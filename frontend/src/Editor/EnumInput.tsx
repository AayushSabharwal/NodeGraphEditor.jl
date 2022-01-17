import { Select } from "@chakra-ui/react";

export interface EnumInputProps {
    options: string[]
    value: number
    onChange: (index: number) => void
}

export function EnumInput(props: EnumInputProps) {
    return (
        <Select value={props.options[props.value]} onChange={e => props.onChange(e.target.selectedIndex)}>
            {props.options.map(o => <option value={o} key={o}>{o}</option>)}
        </Select>
    );
}