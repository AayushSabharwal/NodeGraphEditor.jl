import { DeleteOutlined } from "@ant-design/icons";
import { Button, Collapse, Input } from "antd";
import { NodeData, NodeMenuProps } from "lib/types";
import React from "react";
import { CapacitanceMenu } from "./NodeMenuRenderers/CapacitanceMenu";
import { InductanceMenu } from "./NodeMenuRenderers/InductanceMenu";
import { ResistanceMenu } from "./NodeMenuRenderers/ResistanceMenu";
import { VoltageSourceMenu } from "./NodeMenuRenderers/VoltageSourceMenu";
import './NodeMenu.scss';

export class NodeMenu extends React.Component<NodeMenuProps>{
    nodePanel(ind: number) {
        const node = this.props.nodes[ind];
        const header = (
            <div className="header">
                <Input
                    defaultValue={node.node_name}
                    onChange={e => this.props.updateNode(
                        ind,
                        { ...node, node_name: e.target.value }
                    )}
                    className="input headeritem"
                />
                <Button
                    className="headeritem"
                    type="primary"
                    shape="circle"
                    danger
                    icon={<DeleteOutlined twoToneColor='red' />}
                    onClick={() => this.props.deleteNode(node.node_id)}
                />
            </div>
        );

        return (
            <Collapse.Panel key={node.node_id} header={header}>
                {this.chooseNodeMenu(node)}
            </Collapse.Panel>
        );
    }

    chooseNodeMenu(node: NodeData) {
        switch (node.params.type) {
            case "VoltageSource": return <VoltageSourceMenu
                key={node.node_id}
                params={node.params}
                node_id={node.node_id}
                onChangeParams={this.props.updateNodeParams}
            />;
            case "Resistance": return <ResistanceMenu
                key={node.node_id}
                params={node.params}
                node_id={node.node_id}
                onChangeParams={this.props.updateNodeParams}
            />;
            case "Inductance": return <InductanceMenu
                key={node.node_id}
                params={node.params}
                node_id={node.node_id}
                onChangeParams={this.props.updateNodeParams}
            />;
            case "Capacitance": return <CapacitanceMenu
                key={node.node_id}
                params={node.params}
                node_id={node.node_id}
                onChangeParams={this.props.updateNodeParams}
            />;
            default: console.error("Unhandled NodeType Menu");
                return null;
        }
    }

    render() {
        return (
            <Collapse className="collapse">
                {this.props.nodes.map((_, i) => this.nodePanel(i))}
            </Collapse>
        )
    }
}