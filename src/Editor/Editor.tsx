import React from "react";
import { DefaultCapacitance, DefaultInductance, DefaultNodeData, DefaultResistance, DefaultVoltageSource, DIVIDER_WIDTH, DRAG_BUTTON } from "lib/constants";
import { calculateNodeSize } from "NodeGraph/Node";
import { Stage } from "NodeGraph/Stage";
import { Edge, EditorState, NodeData, NodeType } from "lib/types";
import './Editor.scss';
import { VoltageSourceMenu } from "./NodeMenuRenderers/VoltageSourceMenu";
import { ResistanceMenu } from "./NodeMenuRenderers/ResistanceMenu";
import { InductanceMenu } from "./NodeMenuRenderers/InductanceMenu";
import { CapacitanceMenu } from "./NodeMenuRenderers/CapacitanceMenu";
import { DropdownButton } from "./DropdownButton";

export class Editor extends React.Component<{}, EditorState> {
    state: EditorState = {
        nodes: [
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
                pos: { x: 50, y: 50 },
                params: { ...DefaultResistance }
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
        newnode_id: 2,
    }

    constructor(props: {}) {
        super(props);
        this.state.nodes = this.state.nodes.map(node => ({
            ...node,
            size: calculateNodeSize(
                Math.max(node.params.inputs, node.params.outputs),
                {
                    x: 10 * node.params.type.length,
                    y: 16
                }
            )
        }));

        this.updateNode = this.updateNode.bind(this);
        this.addEdge = this.addEdge.bind(this);
        this.onResizerMouseDown = this.onResizerMouseDown.bind(this);
        this.onResizerMouseMove = this.onResizerMouseMove.bind(this);
        this.onResizerMouseUp = this.onResizerMouseUp.bind(this);
        this.selectNode = this.selectNode.bind(this);
        this.updateNodeParams = this.updateNodeParams.bind(this);
        this.chooseNodeMenu = this.chooseNodeMenu.bind(this);
        this.addNode = this.addNode.bind(this);
        this.deleteNode = this.deleteNode.bind(this);
    }

    updateNodeParams<T extends NodeType>(id: number, params: T) {
        const ind = this.state.nodes.findIndex(n => n.node_id === id);
        const nodes = this.state.nodes;
        const node = nodes[ind];
        nodes.splice(ind, 1, {
            ...node,
            params,
        });
        this.setState({ nodes });
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

    addNode(type: string) {
        let newnode: NodeData = {
            ...DefaultNodeData,
            node_name: type,
            node_id: this.state.newnode_id,
            params: { ...DefaultVoltageSource },
        };
        switch (type) {
            case "VoltageSource":
                newnode.params = { ...DefaultVoltageSource }
                break;
            case "Resistance":
                newnode.params = { ...DefaultResistance };
                break;
            case "Capacitance":
                newnode.params = { ...DefaultCapacitance };
                break;
            case "Inductance":
                newnode.params = { ...DefaultInductance };
                break;
            default:
                console.error("Unhandled Add Node type");
                return;
        }
        newnode.size = calculateNodeSize(
            Math.max(newnode.params.inputs, newnode.params.outputs),
            {
                x: 10 * newnode.params.type.length,
                y: 16
            }
        )
        this.setState({
            nodes: [...this.state.nodes, newnode],
            newnode_id: this.state.newnode_id + 1,
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

    deleteNode(id: number) {
        let nodes = this.state.nodes;
        nodes = nodes.filter(node => node.node_id !== id);
        let edges = this.state.edges;
        edges = edges.filter(e => e.from !== id && e.to !== id);
        this.setState({ nodes, edges });
    }

    chooseNodeMenu(ind: number) {
        const node = this.state.nodes[ind];
        switch (node.params.type) {
            case "VoltageSource": return <VoltageSourceMenu
                key={node.node_id}
                params={node.params}
                node_id={node.node_id}
                node_name={node.node_name}
                onChangeName={n => this.updateNode(ind, { ...node, node_name: n })}
                onChangeParams={this.updateNodeParams}
                onDelete={this.deleteNode}
            />;
            case "Resistance": return <ResistanceMenu
                key={node.node_id}
                params={node.params}
                node_id={node.node_id}
                node_name={node.node_name}
                onChangeName={n => this.updateNode(ind, { ...node, node_name: n })}
                onChangeParams={this.updateNodeParams}
                onDelete={this.deleteNode}
            />;
            case "Inductance": return <InductanceMenu
                key={node.node_id}
                params={node.params}
                node_id={node.node_id}
                node_name={node.node_name}
                onChangeName={n => this.updateNode(ind, { ...node, node_name: n })}
                onChangeParams={this.updateNodeParams}
                onDelete={this.deleteNode}
            />;
            case "Capacitance": return <CapacitanceMenu
                key={node.node_id}
                params={node.params}
                node_id={node.node_id}
                node_name={node.node_name}
                onChangeName={n => this.updateNode(ind, { ...node, node_name: n })}
                onChangeParams={this.updateNodeParams}
                onDelete={this.deleteNode}
            />;
            default: console.error("Unhandled NodeType Menu");
                return null;
        }
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
                    <DropdownButton
                        button_name="Add Node"
                        options={["VoltageSource", "Resistance", "Inductance", "Capacitance"]}
                        width={100}
                        onSelect={this.addNode}
                    />
                    <div className="NodeData">
                        {this.state.nodes.map((_, i) => this.chooseNodeMenu(i))}
                    </div>
                </div>
            </div>
        );
    }
}