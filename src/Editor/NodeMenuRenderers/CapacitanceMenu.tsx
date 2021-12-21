import { KVP } from "Editor/KVP";
import { Capacitance, NodeMenuRendererProps } from "lib/types";
import React from "react";
import { CollapsibleMenu } from "./CollapsibleMenu";

export class CapacitanceMenu extends React.Component<NodeMenuRendererProps<Capacitance>> {
    render() {
        return (
            <CollapsibleMenu label={this.props.node_name} changeLabel={this.props.onChangeName}>
                <KVP
                    keyname="Capacitance"
                    value={this.props.params.capacitance}
                    submitChange={c => this.props.onChangeParams(this.props.node_id, {
                        ...this.props.params,
                        capacitance: c
                    })}
                />
            </CollapsibleMenu>
        );
    }
}