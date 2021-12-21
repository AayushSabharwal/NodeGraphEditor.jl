import { KVP } from "Editor/KVP";
import { Inductance, NodeMenuRendererProps } from "lib/types";
import React from "react";
import { CollapsibleMenu } from "./CollapsibleMenu";

export class InductanceMenu extends React.Component<NodeMenuRendererProps<Inductance>> {
    render() {
        return (
            <CollapsibleMenu label={this.props.node_name} changeLabel={this.props.onChangeName}>
                <KVP
                    keyname="Inductance"
                    value={this.props.params.inductance}
                    submitChange={i => this.props.onChangeParams(this.props.node_id, {
                        ...this.props.params,
                        inductance: i
                    })}
                />
            </CollapsibleMenu>
        );
    }
}