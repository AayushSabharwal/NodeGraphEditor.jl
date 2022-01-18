import './NodeMenu.scss';
import { Box, Button, Icon, Input, SimpleGrid } from "@chakra-ui/react";
import { NumberInputWrapper } from "~/src/Editor/NumberInputWrapper";
import { DeleteIcon } from "@chakra-ui/icons";
import { NodeData } from '~/src/lib/types';
import { EnumInput } from '~/src/Editor/EnumInput';
import { ClampedInput } from './ClampedInput';

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
        if (props.params[k].type === 'Num') {
            grid_items.push(
                <NumberInputWrapper
                    key={`val${k}`}
                    integer={props.params[k].num_type !== 'float'}
                    unsigned={props.params[k].num_type === 'unsigned'}
                    value={props.params[k].value}
                    onChange={v => props.updateNodeParams(node.node_id, k, v)}
                />
            );
        }
        else if (props.params[k].type === 'Enum') {
            grid_items.push(
                <EnumInput
                    options={props.params[k].options}
                    value={props.params[k].value}
                    onChange={v => props.updateNodeParams(node.node_id, k, v)}
                />
            );
        }
        else if (props.params[k].type === 'Clamped') {
            grid_items.push(
                <ClampedInput
                    min={props.params[k].min}
                    max={props.params[k].max}
                    value={props.params[k].value}
                    integer={props.params[k].num_type !== 'float'}
                    unsigned={props.params[k].num_type === 'unsigned'}
                    onChange={v => props.updateNodeParams(
                        node.node_id, k,
                        {
                            min: props.params[k].min,
                            max: props.params[k].max,
                            value: v
                        }
                    )}
                />
            );
        }
        else if (props.params[k].type === 'String') {
            grid_items.push(
                <Input
                    value={props.params[k].value}
                    onChange={v => {console.log(v.target.value); props.updateNodeParams(node.node_id, k, v.target.value)}}
                />
            );
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