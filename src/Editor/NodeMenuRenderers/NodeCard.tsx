import { Button, Card, Collapse, Divider, InputGroup } from "@blueprintjs/core";
import { NodeCardProps, NodeCardState } from "lib/types";
import React from "react";
import './NodeCard.scss';
// import "normalize.css";
// import "@blueprintjs/core/lib/css/blueprint.css";
// import "@blueprintjs/icons/lib/css/blueprint-icons.css";
export class NodeCard extends React.Component<NodeCardProps, NodeCardState> {
    state: NodeCardState = {
        isOpen: false,
    };

    render() {
        return (
            <Card className="menuitem">
                <div className="header">
                    <Button
                        className="headeritem"
                        icon="chevron-down"
                        onClick={() => this.setState({ isOpen: !this.state.isOpen })}
                    />
                    <InputGroup
                        value={this.props.label}
                        onChange={e => this.props.changeLabel(e.target.value)}
                        className="input headeritem"
                    />
                    <Button
                        className="headeritem"
                        icon="trash"
                        intent="danger"
                        onClick={this.props.deleteNode}
                    />
                </div>
                <Collapse isOpen={this.state.isOpen} className="content">
                    <Divider style={{margin: "0px 0px 10px 0px"}}/>
                    {this.props.children}
                </Collapse>
            </Card>
        );
    }
}