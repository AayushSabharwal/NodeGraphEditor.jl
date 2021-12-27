import { KVP } from "Editor/KVP";
import { NodeMenuRendererProps, Resistance } from "lib/types";
import React from "react";

export class ResistanceMenu extends React.Component<NodeMenuRendererProps<Resistance>> {
    render() {
        return (
            <KVP
                label="Resistance"
                unit="Ω"
                value={this.props.params.resistance}
                onChange={r => this.props.onChangeParams(this.props.node_id, {
                    ...this.props.params,
                    resistance: r
                })}
            />
        );
    }
}