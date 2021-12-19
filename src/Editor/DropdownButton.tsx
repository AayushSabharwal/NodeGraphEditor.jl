import { DropdownButtonProps, DropdownButtonState } from "lib/types";
import React from "react";
import './DropdownButton.scss';

export class DropdownButton extends React.Component<DropdownButtonProps, DropdownButtonState> {
    state: DropdownButtonState = {
        isopen: false,
    }

    constructor(props: DropdownButtonProps) {
        super(props);

        this.onButtonPress = this.onButtonPress.bind(this);
    }

    onButtonPress() {
        this.setState({ isopen: !this.state.isopen });
    }

    onSelectItem(opt: string) {
        this.onButtonPress();
        this.props.onSelect(opt);
    }

    render() {
        return (
            <div className="Container">
                <div className="DropdownButton">
                    <div
                        className="DropdownButtonButton"
                        onClick={this.onButtonPress}
                        style={{
                            width: this.props.width ? this.props.width : "fit-content"
                        }}
                    >
                        {this.props.button_name}
                    </div>
                    {this.state.isopen &&
                        this.props.options.map(opt =>
                            <div
                                className="DropdownButtonOption"
                                onClick={() => this.onSelectItem(opt)}
                                key={opt}
                            >
                                {opt}
                            </div>
                        )
                    }
                </div>
            </div>
        )
    }
}