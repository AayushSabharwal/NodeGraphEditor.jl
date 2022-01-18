import { Flex, NumberInput, NumberInputField, Slider, SliderFilledTrack, SliderMark, SliderThumb, SliderTrack, Tooltip } from "@chakra-ui/react";
import { useState } from "preact/hooks";

export interface ClampedInputProps {
    min: number
    max: number
    value: number
    integer: boolean
    unsigned: boolean
    onChange: (val: number) => void
}

export function ClampedInput(props: ClampedInputProps) {
    const [temp_val, set_temp_val] = useState(props.value);
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <Slider
            min={props.min}
            max={props.max}
            value={temp_val}
            step={props.integer ? 1 : 0.01}
            onChange={set_temp_val}
            onChangeEnd={props.onChange}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <SliderMark value={props.min} mt='1' ml='-1' fontSize='sm'>{props.min}</SliderMark>
            <SliderMark value={props.max} mt='1' ml='-4' fontSize='sm'>{props.max}</SliderMark>
            <SliderTrack><SliderFilledTrack/></SliderTrack>
            <Tooltip
                hasArrow
                bg='teal.500'
                color='white'
                placement='top'
                isOpen={showTooltip}
                label={temp_val.toString()}
            >
                <SliderThumb/>
            </Tooltip>
        </Slider>
    )
}