import { NodeMenuProps } from "~/src/lib/types";
import React from "react";
import './NodeMenu.scss';
import { Box, Button, Icon, Input, SimpleGrid } from "@chakra-ui/react";
import { NumberInputWrapper } from "~/src/Editor/NumberInputWrapper";
import { DeleteIcon } from "@chakra-ui/icons";

export class NodeMenu extends React.Component<NodeMenuProps>{
    render() {
        const node = this.props.node;
        if(!node)
            return <Box className='card collapse'></Box>;
        let grid_items = [];
        for (const k in node.params) {
            if(k == "type")
                continue;
            grid_items.push(
                <div className="gridItem uiText">
                    {k}
                </div>,
                <NumberInputWrapper
                    value={node.params[k]}
                    onChange={v => this.props.updateNodeParams(node.node_id, k, v)}
                />
            )
        }

        return (
            <Box className='card collapse'>
                <Box className='header'>
                    <Input
                        className='namefield'
                        defaultValue={node.node_name}
                        onChange={e => this.props.updateNode(node.node_id, "name", e.target.value)}
                    />
                    <Button
                        className='deletebutton'
                        background='red.400'
                        onClick={() => this.props.deleteNode(node.node_id)}
                    >
                        <Icon children={ <DeleteIcon/> } color='white'/>
                    </Button>
                </Box>
                <SimpleGrid templateColumns="2fr 3fr" rowGap="10px" width="100%">
                    {grid_items}
                </SimpleGrid>
            </Box>
        );
    }
}