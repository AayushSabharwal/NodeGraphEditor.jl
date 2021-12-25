import { DropdownSelector } from "Editor/DropdownSelector";
import { KVP } from "Editor/KVP";
import { NodeMenuRendererProps, SourceType, VoltageSource } from "lib/types";
import React from "react";
import { CollapsibleMenu } from "./CollapsibleMenu";

export class VoltageSourceMenu extends React.Component<NodeMenuRendererProps<VoltageSource>> {
    changeParams(o: {}) {
        this.props.onChangeParams(this.props.node_id, { ...this.props.params, ...o });
    }

    getKVPs() {
        switch (this.props.params.source_type) {
            case SourceType.Constant:
                return [<KVP
                    key="Voltage"
                    keyname="Voltage"
                    value={this.props.params.voltage}
                    submitChange={v => this.changeParams({ voltage: v })}
                />];

            case SourceType.Sine:
            case SourceType.Cosine:
            case SourceType.DampedSine:
                let nodes = [
                    <KVP
                        key="Amplitude"
                        keyname="Amplitude"
                        value={this.props.params.voltage}
                        submitChange={v => this.changeParams({ voltage: v })}
                    />,
                    <KVP
                        key="Offset"
                        keyname="Offset"
                        value={this.props.params.offset}
                        submitChange={v => this.changeParams({ offset: v })}
                    />,
                    <KVP
                        key="Frequency"
                        keyname="Frequency"
                        value={this.props.params.frequency}
                        submitChange={v => this.changeParams({ frequency: v })}
                    />,
                    <KVP
                        key="Start Time"
                        keyname="Start Time"
                        value={this.props.params.starttime}
                        submitChange={v => this.changeParams({ starttime: v })}
                    />,
                    <KVP
                        key="Phase"
                        keyname="Phase"
                        value={this.props.params.phase}
                        submitChange={v => this.changeParams({ phase: v })}
                    />,
                ];
                if (this.props.params.source_type === SourceType.DampedSine)
                    nodes.push(<KVP
                        key="Damping Coefficient"
                        keyname="Damping Coefficient"
                        value={this.props.params.damping_coef}
                        submitChange={v => this.changeParams({ damping_coef: v })}
                    />);
                return nodes;

            default:
                console.error("Unhandled SourceType:" + this.props.params.source_type);
        }
        return [];
    }

    render() {
        return (
            <CollapsibleMenu
                label={this.props.node_name}
                changeLabel={this.props.onChangeName}
                deleteNode={() => this.props.onDelete(this.props.node_id)}
            >
                <DropdownSelector
                    width="100px"
                    options={Array(Object.keys(SourceType).length / 2).fill(0).map((_, i) => SourceType[i])}
                    selected={this.props.params.source_type}
                    onSelect={v => this.changeParams({ source_type: v })}
                />
                {this.getKVPs()}
            </CollapsibleMenu >
        );
    }
}