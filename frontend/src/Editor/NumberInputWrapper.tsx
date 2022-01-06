import { NumberInputWrapperProps, NumberInputWrapperState } from "~/src/lib/types";
import React from "react";
import { NumberInput, NumberInputField, Tag } from "@chakra-ui/react";

export class NumberInputWrapper extends React.Component<NumberInputWrapperProps, NumberInputWrapperState> {
    state: NumberInputWrapperState = {
        temp_value: this.props.value.toString(),
        invalid: false,
    }
    constructor(props: NumberInputWrapperProps) {
        super(props);
        this.validateAndSendInput = this.validateAndSendInput.bind(this);
    }

    validateAndSendInput(val: string) {
        this.setState({ temp_value: val });
        let num = +val;
        if (Number.isNaN(num)) {
            this.setState({ invalid: true });
        }
        else {
            this.props.onChange(num);
            this.setState({ invalid: false });
        }
    }

    render() {
        const addonAfter = this.props.unit ? {
            rightElement: <Tag>{this.props.unit}</Tag>
        }
            : {};
        return (
            <NumberInput
                className="uiText"
                value={this.state.temp_value}
                onChange={this.validateAndSendInput}
                isInvalid={this.state.invalid}
            >
                <NumberInputField />
            </NumberInput>
        );
    }
}