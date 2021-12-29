import { FormGroup, NumericInput, Tag } from "@blueprintjs/core";
import { INPUT_WIDTH } from "lib/constants";
import { KVPProps } from "lib/types";
import React from "react";
import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
export class KVP extends React.Component<KVPProps> {
    render() {
        const addonAfter = this.props.unit ? {
            rightElement: <Tag>{this.props.unit}</Tag>
        }
            : {};
        return (
            <FormGroup
                inline
                label={this.props.label}
            >
                <NumericInput
                    width={INPUT_WIDTH}
                    {...addonAfter}
                    onValueChange={this.props.onChange}
                    buttonPosition="none"
                />
            </FormGroup>
        );
    }
}