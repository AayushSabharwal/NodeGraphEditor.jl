import { KVP } from "Editor/KVP";
import { NodeMenuRendererProps, VoltageSource } from "lib/types";
import React from "react";
import { CollapsibleMenu } from "./CollapsibleMenu";

export class VoltageSourceMenu extends React.Component<NodeMenuRendererProps<VoltageSource>> {
    render() {
        return (
            <CollapsibleMenu label={this.props.node_name} changeLabel={this.props.onChangeName}>
                <KVP
                    keyname="Voltage"
                    value={this.props.params.voltage}
                    submitChange={v => this.props.onChangeParams(this.props.node_id, {
                        ...this.props.params,
                        voltage: v
                    })}
                />
            </CollapsibleMenu >
        );
    }
}