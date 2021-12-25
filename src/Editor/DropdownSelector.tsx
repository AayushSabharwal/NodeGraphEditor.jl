import { DropdownSelectorProps } from "lib/types";
import React from "react";
import { DropdownButton } from "./DropdownButton";

export class DropdownSelector extends React.Component<DropdownSelectorProps>{
    render() {
        return <DropdownButton
            button_name={this.props.options[this.props.selected]}
            options={this.props.options}
            onSelect={s => this.props.onSelect(this.props.options.findIndex(o => o === s))}
            width={this.props.width}
        />
    }
}