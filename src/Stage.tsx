import React from "react";
import { Node, NodeProps, Vec2 } from './Node'
import "./Stage.scss"

interface StageProps {
    width: number,
    height: number,
}

interface NodeData extends NodeProps {
    node_id: number,
    isdragging: boolean,
    rel: Vec2,
    dims: Vec2,
    ref: Node | undefined,
    mousemove: (e: MouseEvent) => void,
    mouseup: (e: MouseEvent) => void,
}

interface StageState {
    nodes: NodeData[]
    graph: Record<number, number[]>
}

export class Stage extends React.Component<StageProps, StageState> {
    state: StageState = {
        nodes: [
            {
                node_id: 0,
                name: "First",
                pos: { x: 0, y: 0 },
                isdragging: false,
                rel: { x: 0, y: 0 },
                dims: { x: 0, y: 0 },
                inputs: 1,
                outputs: 2,
                mousemove: e => this.onNodeMouseMove(0, e),
                mouseup: e => this.onNodeMouseUp(0, e),
            } as NodeData,
            {
                node_id: 1,
                name: "Second",
                pos: { x: 50, y: 50 },
                isdragging: false,
                rel: { x: 0, y: 0 },
                dims: { x: 0, y: 0 },
                inputs: 2,
                outputs: 1,
                mousemove: e => this.onNodeMouseMove(1, e),
                mouseup: e => this.onNodeMouseUp(1, e),
            } as NodeData
        ],
        graph: { 0: [], 1: [] }
    }

    constructor(props: StageProps) {
        super(props);
        this.onNodeMouseDown = this.onNodeMouseDown.bind(this);
    }

    componentDidUpdate(_: StageProps, prestate: StageState) {
        for (let ind = 0; ind < this.state.nodes.length; ind++) {
            if (this.state.nodes[ind].isdragging && !prestate.nodes[ind].isdragging) {
                document.addEventListener('mousemove', this.state.nodes[ind].mousemove);
                document.addEventListener('mouseup', this.state.nodes[ind].mouseup);
            }
            else if (!this.state.nodes[ind].isdragging && prestate.nodes[ind].isdragging) {
                document.removeEventListener('mousemove', this.state.nodes[ind].mousemove);
                document.removeEventListener('mouseup', this.state.nodes[ind].mouseup);
            }
        }
    }

    onNodeMouseUp(id: number, e: MouseEvent): void {
        const ind = this.state.nodes.findIndex(o => o.node_id === id);
        let nodes = this.state.nodes;
        nodes[ind].isdragging = false;
        this.setState({ nodes: nodes });
        e.stopPropagation();
        e.preventDefault();
    }

    onNodeMouseMove(id: number, e: MouseEvent): void {
        this.setState({
            nodes: this.state.nodes.map(node => {
                if (node.node_id !== id || !node.isdragging)
                    return node;
                let newpos = {
                    x: e.pageX - node.rel.x,
                    y: e.pageY - node.rel.y,
                }
                if (node.dims.x >= this.props.width || node.dims.y >= this.props.height)
                    return node;
                if (newpos.x < 0) newpos.x = 0;
                if (newpos.x > this.props.width - node.dims.x)
                    newpos.x = this.props.width - node.dims.x;
                if (newpos.y < 0) newpos.y = 0;
                if (newpos.y > this.props.height - node.dims.y)
                    newpos.y = this.props.height - node.dims.y;
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
        this.setState({
            nodes: this.state.nodes.map(
                node => {
                    if (node.node_id === id) {
                        return {
                            ...node,
                            isdragging: true,
                            rel: {
                                x: e.pageX - node.pos.x,
                                y: e.pageY - node.pos.y,
                            }
                        }
                    }
                    return node;
                }
            )
        });
        e.stopPropagation();
        e.preventDefault();
    }

    render(): React.ReactNode {
        let foo = (
            <div
                className="Stage"
                style={{ width: this.props.width + "px", height: this.props.height + "px" }}
            >
                {this.state.nodes.map(node => (
                    <Node
                        key={node.node_id}
                        ref={r => {
                            if (r && r.ref) {
                                node.dims = { x: r.ref.offsetWidth, y: r.ref.offsetHeight }
                                node.ref = r;
                            }
                        }}
                        name={node.name}
                        pos={node.pos}
                        node_id={node.node_id}
                        inputs={node.inputs}
                        outputs={node.outputs}
                        onMouseDown={(e: React.MouseEvent) =>
                            this.onNodeMouseDown(node.node_id, e)
                        }
                    />
                ))}
            </div>
        );

        return foo;
    }
}