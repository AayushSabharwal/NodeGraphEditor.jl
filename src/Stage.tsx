import React from "react";
import { Node, calculateConnectorX, calculateConnectorY } from './Node'
import { Connection } from "./Connection";
import { CONN_RADIUS, CONN_SIDE_MARGIN, DRAG_BUTTON, MAX_ZOOM, MIN_ZOOM, PAN_BUTTON, ZOOM_SPEED } from "./constants";
import { ConnectorType, Vec2, StageProps, Edge, StageState } from "./types";
import "./Stage.scss"

function calculateContentX(parent_pos: Vec2) {
    return parent_pos.x + 2 * (CONN_SIDE_MARGIN + CONN_RADIUS);
}

function calculateContentY(parent_pos: Vec2, parent_size: Vec2) {
    return parent_pos.y + parent_size.y / 2;
}

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
            type: "input",
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

    constructor(props: StageProps) {
        super(props);

        this.onNodeMouseDown = this.onNodeMouseDown.bind(this);
        this.onNodeMouseUp = this.onNodeMouseUp.bind(this);
        this.onNodeMouseMove = this.onNodeMouseMove.bind(this);
        this.onConnectorMouseDown = this.onConnectorMouseDown.bind(this);
        this.onConnectorMouseUp = this.onConnectorMouseUp.bind(this);
        this.onConnectorMouseMove = this.onConnectorMouseMove.bind(this);
        this.onNotConnectorMouseUp = this.onNotConnectorMouseUp.bind(this);
        this.getViewportString = this.getViewportString.bind(this);
        this.onPanMouseDown = this.onPanMouseDown.bind(this);
        this.onPanMouseMove = this.onPanMouseMove.bind(this);
        this.onPanMouseUp = this.onPanMouseUp.bind(this);
        this.onZoomWheel = this.onZoomWheel.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.onPanMouseDown);
        document.oncontextmenu = (e) => { e.preventDefault(); return false; }

    }

    componentDidUpdate(_: StageProps, prestate: StageState) {
        if (this.state.isdragging && !prestate.isdragging) {
            document.addEventListener('mousemove', this.onNodeMouseMove);
            document.addEventListener('mouseup', this.onNodeMouseUp);
        }
        else if (!this.state.isdragging && prestate.isdragging) {
            document.removeEventListener('mousemove', this.onNodeMouseMove);
            document.removeEventListener('mouseup', this.onNodeMouseUp);
        }

        if (this.state.isconnecting && !prestate.isconnecting) {
            document.addEventListener('mousemove', this.onConnectorMouseMove);
            document.addEventListener('mouseup', this.onNotConnectorMouseUp);
        }
        else if (!this.state.isconnecting && prestate.isconnecting) {
            document.removeEventListener('mousemove', this.onConnectorMouseMove);
            document.removeEventListener('mouseup', this.onNotConnectorMouseUp);
        }
    }

    onNodeMouseUp(e: MouseEvent): void {
        if (e.button !== DRAG_BUTTON || !this.state.isdragging)
            return;

        this.setState({ isdragging: false, dragging_ind: -1 });
        e.stopPropagation();
        e.preventDefault();
    }

    onNodeMouseMove(e: MouseEvent): void {
        this.props.updateNode(this.state.dragging_ind, {
            ...this.props.nodes[this.state.dragging_ind],
            pos: {
                x: this.state.node_dragstart.x + (e.pageX - this.state.dragstart.x) * this.state.viewport.zoom,
                y: this.state.node_dragstart.y + (e.pageY - this.state.dragstart.y) * this.state.viewport.zoom,
            }
        });

        e.stopPropagation();
        e.preventDefault();
    }

    onNodeMouseDown(id: number, e: React.MouseEvent) {
        if (e.button !== DRAG_BUTTON)
            return;
        const ind = this.props.nodes.findIndex(n => n.node_id === id);
        const node = this.props.nodes[ind];
        this.setState({
            isdragging: true,
            dragging_ind: ind,
            dragstart: {
                x: e.pageX,
                y: e.pageY,
            },
            node_dragstart: {
                x: node.pos.x,
                y: node.pos.y,
            }
        });
        e.stopPropagation();
        e.preventDefault();
    }

    onConnectorMouseDown(parent_id: number, type: ConnectorType, conn: number, e: React.MouseEvent) {
        if (e.button !== DRAG_BUTTON)
            return;

        this.setState({
            isconnecting: true,
            connection: {
                from: parent_id,
                type: type,
                conn: conn,
            },
            dragstart: {
                x: e.pageX,
                y: e.pageY,
            }
        });
        e.stopPropagation();
        e.preventDefault();
    }

    onConnectorMouseMove(e: MouseEvent) {
        let dragstart = {
            x: e.pageX,
            y: e.pageY,
        }
        if (dragstart.x < 0) dragstart.x = 0;
        if (dragstart.x > this.props.width) dragstart.x = this.props.width;
        if (dragstart.y < 0) dragstart.y = 0;
        if (dragstart.y > this.props.height) dragstart.y = this.props.height;

        this.setState({
            dragstart,
        });

        e.stopPropagation();
        e.preventDefault();
    }

    onConnectorMouseUp(parent_id: number, type: ConnectorType, conn: number, e: React.MouseEvent) {
        if (e.button !== DRAG_BUTTON || !this.state.isconnecting || parent_id === this.state.connection.from) {
            this.setState({ isconnecting: false });
            e.preventDefault();
            return;
        }
        this.props.addEdge({
            from: this.state.connection.from,
            from_type: this.state.connection.type,
            from_conn: this.state.connection.conn,
            to: parent_id,
            to_type: type,
            to_conn: conn,
        });

        this.setState({
            isconnecting: false,
            connection: {
                from: -1,
                type: "input",
                conn: -1,
            },
        });

        e.preventDefault();
    }

    onNotConnectorMouseUp(e: MouseEvent) {
        if (e.button !== DRAG_BUTTON)
            return;
        this.setState({
            isconnecting: false,
        });

        e.stopPropagation();
        e.preventDefault();
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

    onZoomWheel(e: React.WheelEvent<SVGSVGElement>) {
        this.setState({
            viewport: {
                ...this.state.viewport,
                zoom: Math.max(
                    MIN_ZOOM,
                    Math.min(MAX_ZOOM, this.state.viewport.zoom + e.deltaY * ZOOM_SPEED)
                ),
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
            connline = <Connection
                from={{
                    x: calculateConnectorX(
                        this.props.nodes[this.props.nodes.findIndex(n => n.node_id === this.state.connection.from)].pos,
                        this.props.nodes[this.props.nodes.findIndex(n => n.node_id === this.state.connection.from)].size,
                        this.state.connection.type,
                    ),
                    y: calculateConnectorY(
                        this.props.nodes[this.props.nodes.findIndex(n => n.node_id === this.state.connection.from)].pos,
                        this.state.connection.conn,
                    ),
                }}
                to={{
                    x: this.state.dragstart.x * this.state.viewport.zoom + this.state.viewport.pos.x,
                    y: this.state.dragstart.y * this.state.viewport.zoom + this.state.viewport.pos.y,
                }}
            />
        }

        return (
            <svg
                className="Stage"
                width={this.props.width}
                height={this.props.height}
                viewBox={this.getViewportString()}
                onWheel={this.onZoomWheel}
            >
                {this.props.nodes.map(node => (
                    <Node
                        key={node.node_id}
                        {...node}
                        onMouseDown={(e: React.MouseEvent) =>
                            this.onNodeMouseDown(node.node_id, e)
                        }
                        onConnectorMouseDown={this.onConnectorMouseDown}
                        onConnectorMouseUp={this.onConnectorMouseUp}
                    >
                        <text
                            x={calculateContentX(node.pos)}
                            y={calculateContentY(node.pos, node.size)}
                            className="ContentText"
                        >
                            TEXT
                        </text>

                    </Node>
                ))}
                {this.props.edges.map(edge => {
                    const node_from = this.props.nodes.find(n => n.node_id === edge.from);
                    if (!node_from) return <g key={getEdgeKey(edge)}></g>
                    const node_to = this.props.nodes.find(n => n.node_id === edge.to);
                    if (!node_to) return <g key={getEdgeKey(edge)}></g>
                    return <Connection
                        key={getEdgeKey(edge)}
                        from={{
                            x: calculateConnectorX(node_from.pos, node_from.size, edge.from_type),
                            y: calculateConnectorY(node_from.pos, edge.from_conn),
                        }}
                        to={{
                            x: calculateConnectorX(node_to.pos, node_to.size, edge.to_type),
                            y: calculateConnectorY(node_to.pos, edge.to_conn),
                        }}
                    />;
                })}
                {connline}
            </svg>
        );
    }
}