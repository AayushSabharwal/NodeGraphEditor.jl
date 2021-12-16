import React from "react";
import { DefaultNodeData } from "./constants";
import { calculateNodeSize } from "./Node";
import { Stage } from "./Stage";
import { Edge, NodeData } from "./types";

interface EditorState {
    nodes: NodeData[],
    edges: Edge[],
}

export class Editor extends React.Component<{}, EditorState> {
    state: EditorState = {
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
        edges: [{
            from: 0,
            from_type: "output",
            from_conn: 1,
            to: 1,
            to_type: "input",
            to_conn: 1,
        }],
    }

    constructor(props: {}) {
        super(props);
        this.state.nodes = this.state.nodes.map(node => ({
            ...node,
            size: calculateNodeSize(Math.max(node.inputs, node.outputs))
        }));

        this.updateNode = this.updateNode.bind(this);
        this.addEdge = this.addEdge.bind(this);
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

    render() {
        return (
            <Stage
                width={window.innerWidth / 2}
                height={749.9999}
                nodes={this.state.nodes}
                edges={this.state.edges}
                updateNode={this.updateNode}
                addEdge={this.addEdge}
            />
        );
    }
}