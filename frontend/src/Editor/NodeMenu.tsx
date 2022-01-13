import './NodeMenu.scss';
import { Box, Button, Icon, Input, SimpleGrid } from "@chakra-ui/react";
import { NumberInputWrapper } from "~/src/Editor/NumberInputWrapper";
import { DeleteIcon } from "@chakra-ui/icons";
import { NodeData } from '~/src/lib/types';

export interface NodeMenuProps {
    node: NodeData | undefined,
    updateNode: (ind: number, key: string, value: any) => void,
    updateNodeParams: (id: number, key: string, value: any) => void,
    deleteNode: (id: number) => void,
}


export function NodeMenu(props: NodeMenuProps) {
    const node = props.node;
    
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
                onChange={v => props.updateNodeParams(node.node_id, k, v)}
            />
        )
    }

    return (
        <Box className='card collapse'>
            <Box className='header'>
                <Input
                    className='namefield'
                    defaultValue={node.node_name}
                    onChange={e => props.updateNode(node.node_id, "name", e.target.value)}
                />
                <Button
                    className='deletebutton'
                    background='red.400'
                    onClick={() => props.deleteNode(node.node_id)}
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