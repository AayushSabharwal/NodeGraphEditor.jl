import React from "react";
import { Node, NodeProps, Vec2, calculateNodeSize, ConnectorType } from './Node'
import "./Stage.scss"

interface StageProps {
    width: number,
    height: number,
}

type Edge = {
    from_type: ConnectorType,
    from_conn: number,
    to: number,
    to_type: ConnectorType,
    to_conn: number,
}

interface NodeData extends NodeProps {
    inputs: number,
    outputs: number,
    edges: Edge[]
}

interface StageState {
    nodes: NodeData[],
    isdragging: boolean,
    dragging_ind: number,
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

export class Stage extends React.Component<StageProps, StageState> {
    state: StageState = {
        nodes: [
            {
                ...DefaultNodeData,
                node_id: 0,
                edges: [{
                    from_type: "output",
                    from_conn: 1,
                    to: 1,
                    to_type: "input",
                    to_conn: 1,
                }]
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
    }

    onNodeMouseUp(e: MouseEvent): void {
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

    render() {
        let foo = (
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
                            />
                        )}
                        {Array(node.outputs).fill(1).map((_, i) =>
                            <circle
                                key={i}
                                className="Connector"
                                cx={calculateConnectorX(node, "output")}
                                cy={calculateConnectorY(node, i + 1)}
                            />
                        )}
                    </Node>
                ))}
                {this.state.nodes.map(node =>
                    node.edges.map(edge => {
                        if (node.node_id < edge.to)
                            return <line
                                key={
                                    `${node.node_id}_${edge.from_type}` +
                                    `${edge.from_conn}_${edge.to}_${edge.to_type}${edge.to_conn}`
                                }
                                x1={calculateConnectorX(node, edge.from_type)}
                                y1={calculateConnectorY(node, edge.from_conn)}
                                x2={calculateConnectorX(
                                    this.state.nodes[
                                    this.state.nodes.findIndex(n => n.node_id === edge.to)
                                    ],
                                    edge.to_type
                                )}
                                y2={calculateConnectorY(
                                    this.state.nodes[
                                    this.state.nodes.findIndex(n => n.node_id === edge.to)
                                    ],
                                    edge.to_conn)}
                                stroke="rgb(0,255,0)"
                                strokeWidth={2}
                            />;
                        return <g></g>
                    })
                )}
            </svg>
        );

        return foo;
    }
}