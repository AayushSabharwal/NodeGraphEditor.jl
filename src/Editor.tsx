import React from "react";
import { DefaultNodeData, DefaultResistor, DefaultVoltageSource, DIVIDER_WIDTH, DRAG_BUTTON } from "./constants";
import { calculateNodeSize } from "./Node";
import { Stage } from "./Stage";
import { Edge, EditorState, NodeData } from "./types";
import './Editor.scss';

export class Editor extends React.Component<{}, EditorState> {
    state: EditorState = {
        nodes: [
            {
                ...DefaultNodeData,
                node_id: 0,
                params: { ...DefaultVoltageSource }
            } as NodeData,
            {
                ...DefaultNodeData,
                node_id: 1,
                pos: { x: 50, y: 50 },
                params: { ...DefaultResistor }
            } as NodeData
        ],
        edges: [{
            from: 0,
            from_type: "output",
            from_conn: 1,
            to: 1,
            to_type: "input",
            to_conn: 1,
        }],
        stagewidth: 500,
        selected: -1,
    }

    constructor(props: {}) {
        super(props);
        this.state.nodes = this.state.nodes.map(node => ({
            ...node,
            size: calculateNodeSize(Math.max(node.params.inputs, node.params.outputs))
        }));

        this.updateNode = this.updateNode.bind(this);
        this.addEdge = this.addEdge.bind(this);
        this.onResizerMouseDown = this.onResizerMouseDown.bind(this);
        this.onResizerMouseMove = this.onResizerMouseMove.bind(this);
        this.onResizerMouseUp = this.onResizerMouseUp.bind(this);
        this.selectNode = this.selectNode.bind(this);
    }

    updateNode(ind: number, node: NodeData) {
        let nodes = this.state.nodes;
        nodes.splice(ind, 1, node);
        this.setState({ nodes });
    }

    addEdge(edge: Edge) {
        if (this.state.edges.find(ed =>
            ed.from_conn === edge.from_conn &&
            ed.from_type === edge.from_type &&
            ed.to === edge.to &&
            ed.to_conn === edge.to_conn &&
            ed.to_type === edge.to_type
        ))
            return;
        this.setState({
            edges: [
                ...this.state.edges,
                edge,
            ]
        })
    }

    selectNode(ind: number) {
        let nodes = this.state.nodes;

        if (this.state.selected !== -1) {
            const previous_node = nodes[this.state.selected];
            nodes.splice(this.state.selected, 1, { ...previous_node, selected: false });
        }
        const selected_node = nodes[ind];
        nodes.splice(ind, 1, { ...selected_node, selected: true });
        this.setState({
            selected: ind,
            nodes,
        });
    }

    onResizerMouseDown(e: React.MouseEvent) {
        if (e.button !== DRAG_BUTTON)
            return;
        document.addEventListener('mousemove', this.onResizerMouseMove);
        document.addEventListener('mouseup', this.onResizerMouseUp);
    }

    onResizerMouseMove(e: MouseEvent) {
        this.setState({
            stagewidth: Math.max(0, Math.min(window.innerWidth - DIVIDER_WIDTH, e.pageX))
        });
    }

    onResizerMouseUp(_: MouseEvent) {
        document.removeEventListener('mousemove', this.onResizerMouseMove);
        document.removeEventListener('mouseup', this.onResizerMouseUp);
    }

    render() {
        return (
            <div className="Editor">
                <Stage
                    width={this.state.stagewidth}
                    height={749.9999}
                    nodes={this.state.nodes}
                    edges={this.state.edges}
                    updateNode={this.updateNode}
                    addEdge={this.addEdge}
                    selectNode={this.selectNode}
                />
                <div
                    onMouseDown={this.onResizerMouseDown}
                    style={{
                        position: "absolute",
                        left: this.state.stagewidth,
                        top: 0,
                        background: "black",
                        width: DIVIDER_WIDTH,
                        height: 753
                    }}
                >
                </div>
                <div
                    className="Menu"
                    style={{
                        left: this.state.stagewidth + DIVIDER_WIDTH,
                        width: window.innerWidth - this.state.stagewidth - DIVIDER_WIDTH,
                        height: 753
                    }}
                >

                </div>
            </div>
        );
    }
}