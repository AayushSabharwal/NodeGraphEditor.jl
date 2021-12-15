import React from "react";
import { Node, NodeData, Vec2, calculateNodeSize, ConnectorType, calculateConnectorX, calculateConnectorY } from './Node'
import { Connection } from "./Connection";
import "./Stage.scss"

interface StageProps {
    width: number,
    height: number,
}

type Edge = {
    from: number,
    from_type: ConnectorType,
    from_conn: number,
    to: number,
    to_type: ConnectorType,
    to_conn: number,
}

interface StageState {
    nodes: NodeData[],
    isdragging: boolean,
    dragging_ind: number,
    isconnecting: boolean,
    connection: {
        from: number,
        type: ConnectorType,
        conn: number,
    },
    edges: Edge[],
    ispanning: boolean,
    viewport: {
        pos: Vec2,
        size: Vec2,
    }
    rel: Vec2,
}

const DefaultNodeData = {
    pos: { x: 0, y: 0 },
    size: { x: 150, y: 75 },
    inputs: 1,
    outputs: 1,
    edges: [],
};

function calculateContentX(parent_pos: Vec2) {
    return parent_pos.x + 20;
}

function calculateContentY(parent_pos: Vec2, parent_size: Vec2) {
    return parent_pos.y + parent_size.y / 2;
}

function getEdgeKey(edge: Edge) {
    return `${edge.from}${edge.from_type}${edge.from_conn}_${edge.to}${edge.to_type}${edge.to_conn}`;
}

export class Stage extends React.Component<StageProps, StageState> {
    state: StageState = {
        nodes: [
            {
                ...DefaultNodeData,
                node_id: 0,
            } as NodeData,
            {
                ...DefaultNodeData,
                node_id: 1,
                pos: { x: 50, y: 50 },
                inputs: 2,
                outputs: 1,
            } as NodeData
        ],
        isdragging: false,
        dragging_ind: -1,
        isconnecting: false,
        connection: {
            from: -1,
            conn: -1,
            type: "input",
        },
        edges: [{
            from: 0,
            from_type: "output",
            from_conn: 1,
            to: 1,
            to_type: "input",
            to_conn: 1,
        }],
        ispanning: false,
        viewport: {
            pos: {
                x: 0, y: 0,
            },
            size: {
                x: this.props.width,
                y: this.props.height,
            }
        },
        rel: { x: 0, y: 0 },
    }

    constructor(props: StageProps) {
        super(props);

        this.setState({
            nodes: this.state.nodes.map(node => ({
                ...node,
                size: calculateNodeSize(Math.max(node.inputs, node.outputs))
            }))
        })
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

        document.addEventListener('mousedown', this.onPanMouseDown);
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
        if (e.button !== 0 || !this.state.isdragging)
            return;

        this.setState({ isdragging: false, dragging_ind: -1 });
        e.stopPropagation();
        e.preventDefault();
    }

    onNodeMouseMove(e: MouseEvent): void {
        this.setState({
            nodes: this.state.nodes.map(node => {
                if (node.node_id !== this.state.dragging_ind)
                    return node;
                let newpos = {
                    x: e.pageX - this.state.rel.x,
                    y: e.pageY - this.state.rel.y,
                }

                return {
                    ...node,
                    pos: newpos,
                }
            }),
        });

        e.stopPropagation();
        e.preventDefault();
    }

    onNodeMouseDown(id: number, e: React.MouseEvent) {
        if (e.button !== 0)
            return;
        const ind = this.state.nodes.findIndex(n => n.node_id === id);
        const node = this.state.nodes[ind];
        this.setState({
            isdragging: true,
            dragging_ind: ind,
            rel: {
                x: e.pageX - node.pos.x,
                y: e.pageY - node.pos.y,
            }
        });
        e.stopPropagation();
        e.preventDefault();
    }

    onConnectorMouseDown(parent_id: number, type: ConnectorType, conn: number, e: React.MouseEvent) {
        if (e.button !== 0)
            return;

        this.setState({
            isconnecting: true,
            connection: {
                from: parent_id,
                type: type,
                conn: conn,
            },
            rel: {
                x: e.pageX,
                y: e.pageY,
            }
        });
        e.stopPropagation();
        e.preventDefault();
    }

    onConnectorMouseMove(e: MouseEvent) {
        let rel = {
            x: e.pageX,
            y: e.pageY,
        }
        if (rel.x < 0) rel.x = 0;
        if (rel.x > this.props.width) rel.x = this.props.width;
        if (rel.y < 0) rel.y = 0;
        if (rel.y > this.props.height) rel.y = this.props.height;

        this.setState({
            rel,
        });

        e.stopPropagation();
        e.preventDefault();
    }

    onConnectorMouseUp(parent_id: number, type: ConnectorType, conn: number, e: React.MouseEvent) {
        if (e.button !== 0 || !this.state.isconnecting || parent_id === this.state.connection.from) {
            this.setState({ isconnecting: false });
            e.stopPropagation();
            e.preventDefault();
            return;
        }
        if (this.state.edges.find(ed =>
            ed.from_conn === this.state.connection.conn &&
            ed.from_type === this.state.connection.type &&
            ed.to === parent_id &&
            ed.to_conn === conn &&
            ed.to_type === type
        )) {
            this.setState({ isconnecting: false });
            e.stopPropagation();
            e.preventDefault();
            return;
        }
        this.setState({
            isconnecting: false,
            connection: {
                from: -1,
                type: "input",
                conn: -1,
            },
            edges: [
                ...this.state.edges,
                {
                    from: this.state.connection.from,
                    from_type: this.state.connection.type,
                    from_conn: this.state.connection.conn,
                    to: parent_id,
                    to_type: type,
                    to_conn: conn,
                }
            ],
        });

        e.stopPropagation();
        e.preventDefault();
    }

    onNotConnectorMouseUp(e: MouseEvent) {
        if (e.button !== 0)
            return;
        this.setState({
            isconnecting: false,
        });

        e.stopPropagation();
        e.preventDefault();
    }

    onPanMouseDown(e: MouseEvent) {
        if (e.button !== 1)
            return;
        this.setState({
            ispanning: true,
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
                    x: vp.pos.x - e.movementX,
                    y: vp.pos.y - e.movementY,
                },
                size: vp.size,
            }
        });

        e.stopPropagation();
        e.preventDefault();
    }

    onPanMouseUp(e: MouseEvent) {
        if (e.button !== 1)
            return;

        document.removeEventListener('mousemove', this.onPanMouseMove);
        document.removeEventListener('mouseup', this.onPanMouseUp);

        this.setState({
            ispanning: false,
        });

        e.stopPropagation();
        e.preventDefault();
    }

    getViewportString() {
        const vp = this.state.viewport;
        return `${vp.pos.x} ${vp.pos.y} ${vp.size.x} ${vp.size.y}`;
    }

    render() {
        let connline = null;
        if (this.state.isconnecting) {
            connline = <Connection
                from={{
                    x: calculateConnectorX(
                        this.state.nodes[this.state.nodes.findIndex(n => n.node_id === this.state.connection.from)].pos,
                        this.state.nodes[this.state.nodes.findIndex(n => n.node_id === this.state.connection.from)].size,
                        this.state.connection.type,
                    ),
                    y: calculateConnectorY(
                        this.state.nodes[this.state.nodes.findIndex(n => n.node_id === this.state.connection.from)].pos,
                        this.state.connection.conn,
                    )
                }}
                to={this.state.rel}
            />
        }

        return (
            <svg
                className="Stage"
                width={this.props.width}
                height={this.props.height}
                viewBox={this.getViewportString()}
            >
                {this.state.nodes.map(node => (
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
                {this.state.edges.map(edge => {
                    const node_from = this.state.nodes.find(n => n.node_id === edge.from);
                    if (!node_from) return <g key={getEdgeKey(edge)}></g>
                    const node_to = this.state.nodes.find(n => n.node_id === edge.to);
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