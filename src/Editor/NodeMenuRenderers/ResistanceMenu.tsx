import { KVP } from "Editor/KVP";
import { NodeMenuRendererProps, Resistance } from "lib/types";
import React from "react";
import { CollapsibleMenu } from "./CollapsibleMenu";

export class ResistanceMenu extends React.Component<NodeMenuRendererProps<Resistance>> {
    render() {
        return (
            <CollapsibleMenu
                label={this.props.node_name}
                changeLabel={this.props.onChangeName}
                deleteNode={() => this.props.onDelete(this.props.node_id)}
            >
                <KVP
                    keyname="Resistance"
                    value={this.props.params.resistance}
                    submitChange={r => this.props.onChangeParams(this.props.node_id, {
                        ...this.props.params,
                        resistance: r
                    })}
                />
            </CollapsibleMenu>
        );
    }
}