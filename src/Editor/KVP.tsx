import { KVPProps, KVPState } from "lib/types";
import React from "react";

export class KVP extends React.Component<KVPProps, KVPState> {
    state: KVPState = {
        temp_value: this.props.value.toString()
    }

    constructor(props: KVPProps) {
        super(props);

        this.onValueChange = this.onValueChange.bind(this);
        this.onLoseFocus = this.onLoseFocus.bind(this);
    }

    onValueChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ temp_value: e.target.value });
        if (e.target.value.length === 0)
            return;

        const value = parseFloat(e.target.value);
        if (!isNaN(value)) {
            this.props.submitChange(value);
        }
    }

    onLoseFocus(e: React.FocusEvent) {
        if (this.state.temp_value.length !== 0)
            return;
        this.setState({ temp_value: "0" });
        this.props.submitChange(0);
    }

    render() {

        return (
            <div className="KVP">
                <label htmlFor={this.props.keyname} className="KVPKey">{this.props.keyname}</label>
                <input
                    type="number"
                    id={this.props.keyname}
                    name={this.props.keyname}
                    value={this.state.temp_value}
                    onChange={this.onValueChange}
                    onBlur={this.onLoseFocus}
                />
            </div>
        );
    }
}