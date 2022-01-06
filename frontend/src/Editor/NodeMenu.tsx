import { NodeMenuProps } from "~/src/lib/types";
import React from "react";
import './NodeMenu.scss';
import { Box, SimpleGrid } from "@chakra-ui/react";
import { NumberInputWrapper } from "~/src/Editor/NumberInputWrapper";

export class NodeMenu extends React.Component<NodeMenuProps>{
    render() {
        const node = this.props.node;
        let grid_items = [];
        if (node) {
            for (const k in node.params) {
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
        }
        return (
            <Box className='card collapse'>
                <SimpleGrid templateColumns="2fr 3fr" rowGap="10px" width="100%">
                    {grid_items}
                </SimpleGrid>
            </Box>
        );
    }
}