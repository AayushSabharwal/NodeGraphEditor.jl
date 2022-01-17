import React, { useState } from "react";
import { NumberInput, NumberInputField, Tag } from "@chakra-ui/react";

export interface NumberInputWrapperProps {
    value: number
    unsigned: boolean
    integer: boolean
    unit?: React.ReactNode
    onChange: (value: number) => void
}

export function NumberInputWrapper(props: NumberInputWrapperProps) {
    const [temp_value, set_temp_value] = useState(props.value.toString());

    const validateAndSendInput = (val: string) => {
        set_temp_value(val);

        let num = +val;
        if (Number.isNaN(num))
            return;
        else {
            if (props.integer && num !== Math.floor(num)) {
                num = Math.floor(num);
                set_temp_value(Math.floor(num).toString());
            }
            if (props.unsigned && num < 0) {
                num = 0;
                set_temp_value('0');
            }
            props.onChange(num);
        }
    }

    const onBlur = () => set_temp_value(props.value.toString());

    const addonAfter = props.unit ? {
        rightElement: <Tag>{props.unit}</Tag>
    }
        : {};
    return (
        <NumberInput
            value={temp_value}
            onChange={validateAndSendInput}
            onBlur={onBlur}
            min={props.unsigned ? 0 : -Infinity}
        >
            <NumberInputField />
        </NumberInput>
    );
}
