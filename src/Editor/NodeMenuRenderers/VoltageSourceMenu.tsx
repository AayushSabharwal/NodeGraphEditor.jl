import { Button, FormGroup, Label, MenuItem } from "@blueprintjs/core";
import { ItemRenderer, Select } from "@blueprintjs/select";
import { KVP } from "Editor/KVP";
import { NodeMenuRendererProps, SourceType, VoltageSource } from "lib/types";
import React from "react";
import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
const SourceTypeSelect = Select.ofType<SourceType>();

export class VoltageSourceMenu extends React.Component<NodeMenuRendererProps<VoltageSource>> {
    changeParams(o: {}) {
        this.props.onChangeParams(this.props.node_id, { ...this.props.params, ...o });
    }

    getOptions() {
        switch (this.props.params.source_type) {
            case SourceType.Constant:
                return [
                    <KVP
                        label="Voltage"
                        key="Voltage"
                        unit="V"
                        value={this.props.params.voltage}
                        onChange={v => this.changeParams({ voltage: v })}
                    />];

            case SourceType.Sine:
            case SourceType.Cosine:
            case SourceType.DampedSine:
                let nodes = [
                    <KVP
                        label="Amplitude"
                        key="Amplitude"
                        unit="V"
                        value={this.props.params.voltage}
                        onChange={v => this.changeParams({ voltage: v })}
                    />,
                    <KVP
                        label="Offset"
                        key="Offset"
                        unit="V"
                        value={this.props.params.offset}
                        onChange={v => this.changeParams({ offset: v })}
                    />,
                    <KVP
                        label="Frequency"
                        key="Frequency"
                        unit="Hz"
                        value={this.props.params.frequency}
                        onChange={v => this.changeParams({ frequency: v })}
                    />,
                    <KVP
                        label="Start Time"
                        key="Start Time"
                        unit="s"
                        value={this.props.params.starttime}
                        onChange={v => this.changeParams({ starttime: v })}
                    />,
                    <KVP
                        label="Phase"
                        key="Phase"
                        unit="rad"
                        value={this.props.params.phase}
                        onChange={v => this.changeParams({ phase: v })}
                    />,
                ];
                if (this.props.params.source_type === SourceType.DampedSine)
                    nodes.push(<KVP
                        label="Damping Coefficient"
                        key="Damping Coefficient"
                        value={this.props.params.damping_coef}
                        onChange={v => this.changeParams({ damping_coef: v })}
                    />);
                return nodes;

            default:
                console.error("Unhandled SourceType:" + this.props.params.source_type);
        }
        return [];
    }

    renderSourceType: ItemRenderer<number> = (s, { handleClick }) => {
        return <MenuItem key={s} onClick={handleClick} text={SourceType[s]} />
    }

    render() {
        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <FormGroup inline label="Source Type">
                    <SourceTypeSelect
                        filterable={false}
                        items={Array(Object.keys(SourceType).length / 2).fill(0).map((_, i) => i)}
                        itemRenderer={this.renderSourceType}
                        onItemSelect={v => this.changeParams({ source_type: v })}
                    >
                        <Button text={SourceType[this.props.params.source_type]} />
                    </SourceTypeSelect>
                </FormGroup>
                {this.getOptions()}
            </div>
        );
    }
}