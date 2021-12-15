import React from "react";
import { Node, NodeProps, Vec2, calculateNodeSize, ConnectorType } from './Node'
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

interface NodeData extends NodeProps {
    inputs: number,
    outputs: number,
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
    edges: Edge[]
    rel: Vec2,
}

const DefaultNodeData = {
    pos: { x: 0, y: 0 },
    size: { x: 150, y: 75 },
    inputs: 1,
    outputs: 1,
    edges: [],
};

function calculateConnectorX(parent: NodeData, type: ConnectorType) {
    if (type === "input")
        return parent.pos.x + 12.5;
    else
        return parent.pos.x + parent.size.x - 12.5;
}

function calculateConnectorY(parent: NodeData, index: number) {
    return parent.pos.y + (index - 1) * 20 + 12.5;
}

function calculateContentX(parent: NodeData) {
    return parent.pos.x + 20;
}

function calculateContentY(parent: NodeData) {
    return parent.pos.y + parent.size.y / 2;
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
        this.onAnywhereMouseUp = this.onAnywhereMouseUp.bind(this);
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
            document.addEventListener('mouseup', this.onAnywhereMouseUp);
        }
        else if (!this.state.isconnecting && prestate.isconnecting) {
            document.removeEventListener('mousemove', this.onConnectorMouseMove);
            document.removeEventListener('mouseup', this.onAnywhereMouseUp);
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
                if (node.size.x >= this.props.width || node.size.y >= this.props.height)
                    return node;
                if (newpos.x < 0) newpos.x = 0;
                if (newpos.x > this.props.width - node.size.x)
                    newpos.x = this.props.width - node.size.x;
                if (newpos.y < 0) newpos.y = 0;
                if (newpos.y > this.props.height - node.size.y)
                    newpos.y = this.props.height - node.size.y;
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

    onAnywhereMouseUp(e: MouseEvent) {
        if (e.button !== 0)
            return;
        this.setState({
            isconnecting: false,
        });

        e.stopPropagation();
        e.preventDefault();
    }


    render() {
        let connline = null;
        if (this.state.isconnecting) {
            console.log("H");
            connline = <line
                x1={calculateConnectorX(
                    this.state.nodes[this.state.nodes.findIndex(n => n.node_id === this.state.connection.from)],
                    this.state.connection.type,
                )}
                y1={calculateConnectorY(
                    this.state.nodes[this.state.nodes.findIndex(n => n.node_id === this.state.connection.from)],
                    this.state.connection.conn,
                )}
                x2={this.state.rel.x}
                y2={this.state.rel.y}
                stroke="rgb(0,255,0)"
                strokeWidth={2}
            />
        }
        return (
            <svg
                className="Stage"
                width={this.props.width}
                height={this.props.height}
            >
                {this.state.nodes.map(node => (
                    <Node
                        key={node.node_id}
                        {...(node as NodeProps)}
                        onMouseDown={(e: React.MouseEvent) =>
                            this.onNodeMouseDown(node.node_id, e)
                        }
                    >
                        <text
                            x={calculateContentX(node)}
                            y={calculateContentY(node)}
                            className="ContentText"
                        >
                            TEXT
                        </text>
                        {Array(node.inputs).fill(1).map((_, i) =>
                            <circle
                                className="Connector"
                                key={i}
                                cx={calculateConnectorX(node, "input")}
                                cy={calculateConnectorY(node, i + 1)}
                                onMouseDown={e => this.onConnectorMouseDown(
                                    node.node_id,
                                    "input",
                                    i + 1,
                                    e,
                                )}
                                onMouseUp={e => this.onConnectorMouseUp(
                                    node.node_id,
                                    "input",
                                    i + 1,
                                    e,
                                )}
                            />
                        )}
                        {Array(node.outputs).fill(1).map((_, i) =>
                            <circle
                                key={i}
                                className="Connector"
                                cx={calculateConnectorX(node, "output")}
                                cy={calculateConnectorY(node, i + 1)}
                                onMouseDown={e => this.onConnectorMouseDown(
                                    node.node_id,
                                    "output",
                                    i + 1,
                                    e,
                                )}
                                onMouseUp={e => this.onConnectorMouseUp(
                                    node.node_id,
                                    "output",
                                    i + 1,
                                    e,
                                )}
                            />
                        )}
                    </Node>
                ))}
                {this.state.edges.map(edge => {
                    const node_from = this.state.nodes.find(n => n.node_id === edge.from);
                    if (!node_from) return <g key={getEdgeKey(edge)}></g>
                    const node_to = this.state.nodes.find(n => n.node_id === edge.to);
                    if (!node_to) return <g key={getEdgeKey(edge)}></g>
                    return <line
                        key={getEdgeKey(edge)}
                        x1={calculateConnectorX(node_from, edge.from_type)}
                        y1={calculateConnectorY(node_from, edge.from_conn)}
                        x2={calculateConnectorX(node_to, edge.to_type)}
                        y2={calculateConnectorY(node_to, edge.to_conn)}
                        stroke="rgb(0,255,0)"
                        strokeWidth={2}
                    />;
                })}
                {connline}
            </svg>
        );
    }
}