import { KVP } from "Editor/KVP";
import { NodeMenuRendererProps, VoltageSource } from "lib/types";
import React from "react";

export class VoltageSourceMenu extends React.Component<NodeMenuRendererProps<VoltageSource>> {
    render() {
        return (
            <div>
                <KVP
                    keyname="Voltage"
                    value={this.props.params.voltage}
                    submitChange={v => this.props.onChangeParams(this.props.node_id, {
                        ...this.props.params,
                        voltage: v
                    })}
                />
            </div>
        );
    }
}