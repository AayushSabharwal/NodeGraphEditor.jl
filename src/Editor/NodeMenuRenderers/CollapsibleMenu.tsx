import { DeleteFilled } from "@ant-design/icons";
import { Button, Collapse, Input } from "antd";
import { CollapsibleMenuProps, CollapsibleMenuState } from "lib/types";
import React from "react";
import './CollapsibleMenu.scss';

export class CollapsibleMenu extends React.Component<CollapsibleMenuProps, CollapsibleMenuState> {
    state: CollapsibleMenuState = {
        collapsed: false,
    };

    render() {
        const header = (
            <div>
                <Input defaultValue={this.props.label} onChange={e => this.props.changeLabel(e.target.value)} />
                <Button type="primary" shape="round" icon={<DeleteFilled />} />
            </div>
        );
        return (
            <Collapse.Panel key={this.props.node_id} header={header}>
                <p>CONTENT</p>
            </Collapse.Panel>
        );
    }
}