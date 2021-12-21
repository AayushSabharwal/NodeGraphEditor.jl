import { ControlledTextField } from "Editor/ControlledTextField";
import { CollapsibleMenuProps, CollapsibleMenuState } from "lib/types";
import React from "react";
import './CollapsibleMenu.scss';

export class CollapsibleMenu extends React.Component<CollapsibleMenuProps, CollapsibleMenuState> {
    state: CollapsibleMenuState = {
        collapsed: false,
    };

    render() {
        return (
            <div className="menuitem">
                <div className="header">
                    <input type="checkbox" onClick={() => this.setState({ collapsed: !this.state.collapsed })} />
                    <ControlledTextField
                        label={this.props.label}
                        submitChange={this.props.changeLabel}
                    />
                    <div className="deletebutton" onClick={() => this.props.deleteNode()}>
                    </div>
                </div>
                {this.state.collapsed || this.props.children}
            </div>
        );
    }
}