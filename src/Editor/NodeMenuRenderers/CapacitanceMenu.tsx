import { KVP } from "Editor/KVP";
import { Capacitance, NodeMenuRendererProps } from "lib/types";
import React from "react";

export class CapacitanceMenu extends React.Component<NodeMenuRendererProps<Capacitance>> {
    render() {
        return (
            <KVP
                label="Capacitance"
                unit="μF"
                value={this.props.params.capacitance}
                onChange={c => this.props.onChangeParams(this.props.node_id, {
                    ...this.props.params,
                    capacitance: c
                })}
            />
        );
    }
}