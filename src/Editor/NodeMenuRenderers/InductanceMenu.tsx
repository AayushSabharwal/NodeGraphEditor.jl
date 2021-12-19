import { KVP } from "Editor/KVP";
import { Inductance, NodeMenuRendererProps } from "lib/types";
import React from "react";

export class InductanceMenu extends React.Component<NodeMenuRendererProps<Inductance>> {
    render() {
        return (
            <div>
                <KVP
                    keyname="Inductance"
                    value={this.props.params.inductance}
                    submitChange={i => this.props.onChangeParams(this.props.node_id, {
                        ...this.props.params,
                        inductance: i
                    })}
                />
            </div>
        );
    }
}