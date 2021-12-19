import { KVP } from "Editor/KVP";
import { NodeMenuRendererProps, Resistance } from "lib/types";
import React from "react";

export class ResistanceMenu extends React.Component<NodeMenuRendererProps<Resistance>> {
    render() {
        return (
            <div>
                <KVP
                    keyname="Resistance"
                    value={this.props.params.resistance}
                    submitChange={r => this.props.onChangeParams(this.props.node_id, {
                        ...this.props.params,
                        resistance: r
                    })}
                />
            </div>
        );
    }
}