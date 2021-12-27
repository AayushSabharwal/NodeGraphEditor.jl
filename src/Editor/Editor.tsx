import React from "react";
import { DefaultCapacitance, DefaultInductance, DefaultNodeData, DefaultResistance, DefaultVoltageSource, DIVIDER_WIDTH, DRAG_BUTTON } from "lib/constants";
import { calculateNodeSize } from "NodeGraph/Node";
import { Stage } from "NodeGraph/Stage";
import { Edge, EditorState, NodeData, NodeType } from "lib/types";
import './Editor.scss';
import { Button, Dropdown, Menu, Space } from "antd";
import { DownOutlined } from '@ant-design/icons';
import 'antd/dist/antd.dark.css';
import { NodeMenu } from "./NodeMenu";

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
                pos: { x: 200, y: 200 },
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
            size: calculateNodeSize(node)
        }));

        this.updateNode = this.updateNode.bind(this);
        this.addEdge = this.addEdge.bind(this);
        this.onResizerMouseDown = this.onResizerMouseDown.bind(this);
        this.onResizerMouseMove = this.onResizerMouseMove.bind(this);
        this.onResizerMouseUp = this.onResizerMouseUp.bind(this);
        this.selectNode = this.selectNode.bind(this);
        this.updateNodeParams = this.updateNodeParams.bind(this);
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
        node.size = calculateNodeSize(node);
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
        newnode.size = calculateNodeSize(newnode);
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
            <Menu onClick={n => this.addNode(n.key)}>
                {["VoltageSource", "Resistance", "Inductance", "Capacitance"].map(s =>
                    <Menu.Item key={s}>{s}</Menu.Item>
                )}
            </Menu>
        );
        return (
            <div className="Editor">
                <Stage
                    width={this.state.stagewidth}
                    height={748}
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
                        height: 748
                    }}
                >
                </div>
                <div
                    className="Menu"
                    style={{
                        left: this.state.stagewidth + DIVIDER_WIDTH,
                        width: window.innerWidth - this.state.stagewidth - DIVIDER_WIDTH,
                        height: 748
                    }}
                >
                    <Space direction="vertical">
                        <Dropdown overlay={AddNodeMenu} trigger={['click']} arrow placement="bottomCenter">
                            <Button>
                                Add Node <DownOutlined />
                            </Button>
                        </Dropdown>
                        <NodeMenu
                            nodes={this.state.nodes}
                            updateNode={this.updateNode}
                            updateNodeParams={this.updateNodeParams}
                            deleteNode={this.deleteNode}
                        />
                    </Space>
                </div>
            </div >
        );
    }
}