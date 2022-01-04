import { NodeData, NodeMenuProps } from "~/src/lib/types";
import React from "react";
import { CapacitanceMenu } from "./NodeMenuRenderers/CapacitanceMenu";
import { InductanceMenu } from "./NodeMenuRenderers/InductanceMenu";
import { ResistanceMenu } from "./NodeMenuRenderers/ResistanceMenu";
import { VoltageSourceMenu } from "./NodeMenuRenderers/VoltageSourceMenu";
import './NodeMenu.scss';
import { NodeCard } from "./NodeMenuRenderers/NodeCard";

export class NodeMenu extends React.Component<NodeMenuProps>{
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
            <div>
                {this.props.nodes.map((n, i) =>
                    <NodeCard
                        key={n.node_id}
                        label={n.node_name}
                        changeLabel={s => this.props.updateNode(i, { ...n, node_name: s })}
                        deleteNode={() => this.props.deleteNode(n.node_id)}
                    >
                        {this.chooseNodeMenu(n)}
                    </NodeCard>
                )}
            </div>
        )
    }
}