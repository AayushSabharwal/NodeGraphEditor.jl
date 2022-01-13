import React, { useState } from "react";
import { NumberInput, NumberInputField, Tag } from "@chakra-ui/react";

export interface NumberInputWrapperProps {
    value: number,
    unit?: React.ReactNode,
    onChange: (value: number) => void,
}

export function NumberInputWrapper(props: NumberInputWrapperProps) {
    const [temp_value, set_temp_value] = useState(props.value.toString());
    const [invalid, setInvalid] = useState(false);

    const validateAndSendInput = (val: string) => {
        set_temp_value(val);

        let num = +val;
        if (Number.isNaN(num))
            setInvalid(true);
        else {
            props.onChange(num);
            setInvalid(false);
        }
    }

    const addonAfter = props.unit ? {
        rightElement: <Tag>{props.unit}</Tag>
    }
        : {};
    return (
        <NumberInput
            value={temp_value}
            onChange={validateAndSendInput}
            isInvalid={invalid}
        >
            <NumberInputField />
        </NumberInput>
    );
}
