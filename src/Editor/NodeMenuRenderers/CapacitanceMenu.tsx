import { KVP } from "Editor/KVP";
import { Capacitance, NodeMenuRendererProps } from "lib/types";
import React from "react";

export class CapacitanceMenu extends React.Component<NodeMenuRendererProps<Capacitance>> {
    render() {
        return (
            <div>
                <KVP
                    keyname="Capacitance"
                    value={this.props.params.capacitance}
                    submitChange={c => this.props.onChangeParams(this.props.node_id, {
                        ...this.props.params,
                        capacitance: c
                    })}
                />
            </div>
        );
    }
}