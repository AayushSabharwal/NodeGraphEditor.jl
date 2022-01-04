import React from "react";
import { DefaultNodeData, DefaultResistance, DefaultVoltageSource, DIVIDER_WIDTH, DRAG_BUTTON } from "~/src/lib/constants";
import { calculateNodeSize } from "~/src/NodeGraph/Node";
import { Stage } from "~/src/NodeGraph/Stage";
import { Edge, EditorState, NodeData, NodeType } from "~/src/lib/types";
import './Editor.scss';
import { NodeMenu } from "~/src/Editor/NodeMenu";
import { Button, FileInput, Menu, MenuItem } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import { NodeGraph } from "~/src/NodeGraph/NodeGraph";
import FileSaver from "file-saver";

export class Editor extends React.Component<{}, EditorState> {
    state: EditorState = {
        graph: new NodeGraph(
            [
                {
                    ...DefaultNodeData,
                    node_name: "VS",
                    node_id: 0,
                    params: { ...DefaultVoltageSource }
                } as NodeData,
                {
                    ...DefaultNodeData,
                    node_name: "Res",
                    node_id: 1,
                    pos: { x: 200, y: 200 },
                    params: { ...DefaultResistance }
                } as NodeData
            ],
            [{
                from: 0,
                from_type: "output",
                from_conn: 1,
                to: 1,
                to_type: "input",
                to_conn: 1,
            }]
        ),
        stagewidth: 900,
        newnode_id: 2,
    }

    constructor(props: {}) {
        super(props);
        this.state.graph.nodes = this.state.graph.nodes.map(node => ({
            ...node,
            size: calculateNodeSize(node)
        }));

        this.updateNode = this.updateNode.bind(this);
        this.addEdge = this.addEdge.bind(this);
        this.onResizerMouseDown = this.onResizerMouseDown.bind(this);
        this.onResizerMouseMove = this.onResizerMouseMove.bind(this);
        this.onResizerMouseUp = this.onResizerMouseUp.bind(this);
        this.updateNodeParams = this.updateNodeParams.bind(this);
        this.addNode = this.addNode.bind(this);
        this.deleteNode = this.deleteNode.bind(this);
        this.saveGraph = this.saveGraph.bind(this);
        this.loadGraph = this.loadGraph.bind(this);
    }

    updateNodeParams<T extends NodeType>(id: number, params: T) {
        this.setState({ graph: this.state.graph.withUpdatedNodeParams(id, params) });
    }

    updateNode(ind: number, node: NodeData) {
        this.setState({ graph: this.state.graph.withUpdatedNode(ind, node) });
    }

    addEdge(edge: Edge) {
        this.setState({ graph: this.state.graph.withNewEdge(edge)});
    }

    addNode(type: string) {
        this.setState({ graph: this.state.graph.withNewNode(type) });
    }

    deleteNode(id: number) {
        this.setState({graph: this.state.graph.withDeletedNode(id) });
    }

    saveGraph() {
        const data = new Blob([this.state.graph.toJSON()], { type: 'application/json' });
        FileSaver.saveAs(data, "circuit.json");
    }

    async loadGraph(e: React.FormEvent<HTMLInputElement>) {
        const files = e.currentTarget.files;
        if(files === null)
            return;
        const text = await files[0].text();
        const val = NodeGraph.fromJSON(text);
        if(typeof val === "string")
            console.log(val);
        else
            this.setState({ graph: val});
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
        const AddNodeMenu = (
            <Menu >
                {["VoltageSource", "Resistance", "Inductance", "Capacitance"].map(s =>
                    <MenuItem key={s} text={s} onClick={() => this.addNode(s)} />
                )}
            </Menu>
        );
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
                    width={this.state.stagewidth}
                    height={height}
                    nodes={this.state.graph.nodes}
                    edges={this.state.graph.edges}
                    updateNode={this.updateNode}
                    addEdge={this.addEdge}
                />
                <div
                    onMouseDown={this.onResizerMouseDown}
                    className="bp3-button Resizer"
                    style={{
                        left: this.state.stagewidth,
                        width: DIVIDER_WIDTH,
                    }}
                ></div>
                <div
                    className="Menu"
                    style={{
                        left: this.state.stagewidth + DIVIDER_WIDTH,
                        width: width - this.state.stagewidth - DIVIDER_WIDTH,
                    }}
                >
                    <Popover2 content={AddNodeMenu} placement="right-end">
                        <Button>
                            Add Node
                        </Button>
                    </Popover2>
                    <Button onClick={this.saveGraph}>Save</Button>
                    <FileInput onInputChange={this.loadGraph} text="Open Circuit..."/>
                    <NodeMenu
                        nodes={this.state.graph.nodes}
                        updateNode={this.updateNode}
                        updateNodeParams={this.updateNodeParams}
                        deleteNode={this.deleteNode}
                    />
                </div>
            </div >
        );
    }
}