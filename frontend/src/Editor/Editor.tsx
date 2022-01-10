import React from "react";
import { Stage } from "~/src/NodeGraph/Stage";
import { Edge, EditorState, Vec2 } from "~/src/lib/types";
import './Editor.scss';
import { NodeMenu } from "~/src/Editor/NodeMenu";
import { NodeGraph } from "~/src/NodeGraph/NodeGraph";
import axios, { AxiosResponse } from "axios";
import { Box } from "@chakra-ui/react";
import { AddNodeButton } from "~/src/Editor/AddNode";

export class Editor extends React.Component<{}, EditorState> {
    state: EditorState = {
        graph: new NodeGraph(),
        stagewidth: 900,
        selected: -1,
    }

    constructor(props: {}) {
        super(props);
        axios.get<NodeGraph>("/graph").then(r => {
            this.setState({ graph: new NodeGraph(r.data.nodes, r.data.edges) });
        }).catch(e => {
            console.log(e);
        });

        this.updateNode = this.updateNode.bind(this);
        this.addEdge = this.addEdge.bind(this);
        this.deleteEdge = this.deleteEdge.bind(this);
        this.updateNodeParams = this.updateNodeParams.bind(this);
        this.addNode = this.addNode.bind(this);
        this.deleteNode = this.deleteNode.bind(this);
        this.onNodeDrag = this.onNodeDrag.bind(this);
        this.onNodeDragEnd = this.onNodeDragEnd.bind(this);
        this.handleGraphPromise = this.handleGraphPromise.bind(this);
        this.onNodeSelect = this.onNodeSelect.bind(this);
    }

    handleGraphPromise(p: Promise<AxiosResponse<NodeGraph>>) {
        p.then(res => {
            this.setState({ graph: new NodeGraph(res.data.nodes, res.data.edges) });
        }).catch(e => console.log(e));
    }

    updateNodeParams(id: number, key: string, value: any) {
        this.handleGraphPromise(this.state.graph.withUpdatedNodeParams(id, key, value))
    }

    updateNode(id: number, key: string, value: any) {
        this.handleGraphPromise(this.state.graph.withUpdatedNode(id, key, value));
    }

    addEdge(edge: Edge) {
        this.handleGraphPromise(this.state.graph.withNewEdge(edge));
    }

    deleteEdge(edge: Edge) {
        this.handleGraphPromise(this.state.graph.withDeletedEdge(edge));
    }

    addNode(type: string) {
        this.handleGraphPromise(this.state.graph.withNewNode(type));
    }

    deleteNode(id: number) {
        this.handleGraphPromise(this.state.graph.withDeletedNode(id));
    }

    onNodeDrag(ind: number, pos: Vec2) {
        let nodes = this.state.graph.nodes;
        let node = nodes[ind];
        node.pos = pos;
        nodes.splice(ind, 1, node);
        this.setState({ graph: new NodeGraph(nodes, this.state.graph.edges) });
    }

    onNodeDragEnd(ind: number) {
        this.updateNode(
            this.state.graph.nodes[ind].node_id,
            "pos",
            this.state.graph.nodes[ind].pos
        );
    }

    onNodeSelect(id: number) {
        this.setState({ selected: id });
    }

    render() {
        const height = Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight,
        );
        const width = Math.max(
            document.body.scrollWidth,
            document.body.offsetWidth,
            document.documentElement.clientWidth,
            document.documentElement.scrollWidth,
            document.documentElement.offsetWidth,
        );
        return (
            <div className="Editor bp3-dark">
                <Stage
                    width={width}
                    height={height}
                    graph={this.state.graph}
                    selection={this.state.selected}
                    dragNode={this.onNodeDrag}
                    onNodeDragEnd={this.onNodeDragEnd}
                    addEdge={this.addEdge}
                    selectNode={this.onNodeSelect}
                    deleteEdge={this.deleteEdge}
                />
                <Box className="rightpanel">
                    <AddNodeButton addNode={this.addNode}/>
                    <NodeMenu
                        node={this.state.selected === -1 ? undefined : this.state.graph.nodes.find(node => node.node_id === this.state.selected)}
                        updateNode={this.updateNode}
                        updateNodeParams={this.updateNodeParams}
                        deleteNode={this.deleteNode}
                    />
                </Box>
            </div >
        );
    }
}