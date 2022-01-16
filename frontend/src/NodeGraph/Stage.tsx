import React from "react";
import { Node, calculateConnectorX, calculateConnectorY } from '~/src/NodeGraph/Node'
import { Connection } from "~/src/NodeGraph/Connection";
import { DRAG_BUTTON, MAX_ZOOM, MIN_ZOOM, PAN_BUTTON, ZOOM_SPEED } from "~/src/lib/constants";
import { ConnectorType, StageProps, Edge, StageState } from "~/src/lib/types";
import "./Stage.scss"
import { BackgroundLayer } from "./BackgroundLayer";
import { NodeLayer } from "./NodeLayer";
import { ConnectionLayer } from "./EdgeLayer";


function getEdgeKey(edge: Edge) {
    return `${edge.from}${edge.from_type}${edge.from_conn}_${edge.to}${edge.to_type}${edge.to_conn}`;
}

export class Stage extends React.Component<StageProps, StageState> {
    state: StageState = {
        isdragging: false,
        dragging_ind: -1,
        isconnecting: false,
        connection: {
            from: -1,
            conn: -1,
            type: ConnectorType.input,
        },
        ispanning: false,
        panstart: { x: 0, y: 0 },
        vp_panstart: { x: 0, y: 0 },
        viewport: {
            pos: {
                x: 0, y: 0,
            },
            zoom: 1,
        },
        dragstart: { x: 0, y: 0 },
        node_dragstart: { x: 0, y: 0 },
    }

    onPanMouseDown(e: MouseEvent) {
        if (e.button !== PAN_BUTTON)
            return;
        this.setState({
            ispanning: true,
            panstart: {
                x: e.pageX,
                y: e.pageY,
            },
            vp_panstart: {
                x: this.state.viewport.pos.x,
                y: this.state.viewport.pos.y,
            }
        });

        document.addEventListener('mousemove', this.onPanMouseMove);
        document.addEventListener('mouseup', this.onPanMouseUp);

        e.stopPropagation();
        e.preventDefault();
    }

    onPanMouseMove(e: MouseEvent) {
        if (!this.state.ispanning)
            return;
        const vp = this.state.viewport;
        this.setState({
            viewport: {
                pos: {
                    x: this.state.vp_panstart.x - (e.pageX - this.state.panstart.x) * vp.zoom,
                    y: this.state.vp_panstart.y - (e.pageY - this.state.panstart.y) * vp.zoom,
                },
                zoom: vp.zoom,
            }
        });

        e.stopPropagation();
        e.preventDefault();
    }

    onPanMouseUp(e: MouseEvent) {
        if (e.button !== PAN_BUTTON)
            return;

        document.removeEventListener('mousemove', this.onPanMouseMove);
        document.removeEventListener('mouseup', this.onPanMouseUp);

        this.setState({
            ispanning: false,
        });

        e.stopPropagation();
        e.preventDefault();
    }

    onZoomWheel(e: WheelEvent) {
        const vp = this.state.viewport;
        const zoom = Math.max(
            MIN_ZOOM,
            Math.min(MAX_ZOOM, this.state.viewport.zoom + e.deltaY * ZOOM_SPEED)
        );
        this.setState({
            viewport: {
                pos: {
                    x: vp.pos.x + e.pageX * (vp.zoom - zoom),
                    y: vp.pos.y + e.pageY * (vp.zoom - zoom),
                },
                zoom,
            }
        });

        e.stopPropagation();
    }

    getViewportString() {
        const vp = this.state.viewport;
        return `${vp.pos.x} ${vp.pos.y} ${this.props.width * vp.zoom} ${this.props.height * vp.zoom}`;
    }

    render() {
        let connline = null;
        if (this.state.isconnecting) {
            const node = this.props.graph.nodes[this.props.graph.findNodeIndex(this.state.connection.from)];
            const from = {
                x: node.pos.x + calculateConnectorX(
                    node.size,
                    this.state.connection.type,
                ),
                y: node.pos.y + calculateConnectorY(
                    this.state.connection.conn,
                ),
            };
            const to = {
                x: this.state.dragstart.x * this.state.viewport.zoom + this.state.viewport.pos.x,
                y: this.state.dragstart.y * this.state.viewport.zoom + this.state.viewport.pos.y + 2,
            };
            connline = <Connection
                from={from}
                from_type={this.state.connection.type}
                from_ind={this.state.connection.conn}
                to={to}
                to_type={to.x > from.x ? ConnectorType.input : ConnectorType.output}
                to_ind={1}
            />
        }

        return (
            <svg
                className="Stage"
                width={this.props.width}
                height={this.props.height}
                viewBox={this.getViewportString()}
                onWheel={this.onZoomWheel}
                xmlns="http://www.w3.org/2000/svg"
            >
                <BackgroundLayer/>
                <NodeLayer
                    graph={this.props.graph}
                    selected={this.props.selection}
                    viewportPos={this.state.viewport.pos}
                    zoom={this.state.viewport.zoom}
                    selectNode={this.props.selectNode}
                    dragNode={this.props.dragNode}
                    onNodeDragEnd={this.props.onNodeDragEnd}
                    addEdge={this.props.addEdge}
                />
                <ConnectionLayer
                    graph={this.props.graph}
                    deleteEdge={this.props.deleteEdge}
                />
            </svg>
        );
    }
}