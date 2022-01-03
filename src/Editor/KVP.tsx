import { FormGroup, NumericInput, Tag } from "@blueprintjs/core";
import { INPUT_WIDTH } from "~/src/lib/constants";
import { KVPProps, KVPState } from "~/src/lib/types";
import React from "react";
import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
export class KVP extends React.Component<KVPProps,KVPState> {
    state: KVPState = {
        temp_value: this.props.value.toString(),
        invalid: false,
    }
    constructor(props: KVPProps) {
        super(props);
        this.validateAndSendInput = this.validateAndSendInput.bind(this);
    }

    validateAndSendInput(_: number, val: string) {
        this.setState({temp_value: val});
        let num = +val;
        if(Number.isNaN(num)) {
            this.setState({invalid: true});
        }
        else {
            this.props.onChange(num);
            this.setState({invalid: false});
        }
    }

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
                    value={this.state.temp_value}
                    onValueChange={this.validateAndSendInput}
                    buttonPosition="none"
                    intent={this.state.invalid ? "danger" : "none"}
                />
            </FormGroup>
        );
    }
}