import { InputNumber } from "antd";
import { INPUT_WIDTH, LABEL_WIDTH, UNIT_WIDTH } from "lib/constants";
import { KVPProps } from "lib/types";
import React from "react";

export class KVP extends React.Component<KVPProps> {
    render() {
        const addonAfter = this.props.unit ? {
            addonAfter: <div style={{ width: UNIT_WIDTH }}>{this.props.unit}</div>
        }
            : {};
        return (
            <InputNumber
                width={INPUT_WIDTH}
                addonBefore={<div style={{ width: LABEL_WIDTH }}>{this.props.label}</div>}
                {...addonAfter}
                value={this.props.value}
                onChange={this.props.onChange}
                controls={false}
            />
        );
    }
}