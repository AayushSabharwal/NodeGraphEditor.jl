import './NodeMenu.scss';
import { Box, Button, Icon, Input, SimpleGrid } from "@chakra-ui/react";
import { NumberInputWrapper } from "~/src/Editor/NumberInputWrapper";
import { DeleteIcon } from "@chakra-ui/icons";
import { NodeData } from '~/src/lib/types';
import { EnumInput } from '~/src/Editor/EnumInput';

export interface NodeMenuProps {
    node: NodeData | undefined
    params: Record<string, any>
    updateNode: (id: number, key: string, value: any) => void
    updateNodeParams: (id: number, key: string, value: any) => void,
    deleteNode: (id: number) => void,
}

export function NodeMenu(props: NodeMenuProps) {
    const node = props.node;

    if (!node)
        return <Box className='card collapse'></Box>;
    
    let grid_items = [];
    for (const k in props.params) {
        if(k == "type")
            continue;
        
        
        grid_items.push(
            <div key={`key${k}`} className="gridItem uiText">
                {k}
            </div>
        );
        
        // numeric
        if (['Int', 'UIn', 'Flo'].find(e => e === props.params[k].type.slice(0,3))) {
            grid_items.push(
                <NumberInputWrapper
                    key={`val${k}`}
                    integer={props.params[k].type[0] != 'F'}
                    unsigned={props.params[k].type[0] == 'U'}
                    value={props.params[k].value}
                    onChange={v => props.updateNodeParams(node.node_id, k, v)}
                />
            );
        }
        else if (props.params[k].type === 'enum') {
            grid_items.push(
                <EnumInput
                    options={props.params[k].options}
                    value={props.params[k].value}
                    onChange={v => props.updateNodeParams(node.node_id, k, v)}
                />
            )
        }
        else
            console.error('Unimplemented Input Type', props.params[k]);
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