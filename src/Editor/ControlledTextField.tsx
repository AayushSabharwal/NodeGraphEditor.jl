import { ControlledTextFieldProps, ControlledTextFieldState } from "lib/types";
import React from "react";
import './ControlledTextField.scss';

export class ControlledTextField extends React.Component<ControlledTextFieldProps, ControlledTextFieldState>{
    state: ControlledTextFieldState = {
        focused: false
    }

    render() {
        const className = `field ${this.state.focused && 'focused'}`
        const height = this.props.height ? this.props.height : "30px";
        const width = this.props.width ? this.props.width : "100%";
        return (
            <div className={className} style={{ height, width }}>
                <input
                    type="text"
                    value={this.props.label}
                    onChange={e => this.props.submitChange(e.target.value)}
                    onFocus={() => this.setState({ focused: true })}
                    onBlur={() => this.setState({ focused: false })}
                />
            </div>
        );
    }
}