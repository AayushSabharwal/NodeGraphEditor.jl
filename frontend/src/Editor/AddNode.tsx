import { Box, Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { useState } from "preact/hooks";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import "./AddNode.scss"

export interface AddNodeButtonProps {
    addNode: (type: string) => void,
}

export function AddNodeButton({ addNode }: AddNodeButtonProps) {
    const [types, setTypes] = useState(['']);

    const getOptions = () => {
        axios.get<{types: string[]}>('/types').then(r => {
            setTypes(r.data.types);
        })
    }

    return (
        <Box className='background'>
            <Menu>
                <MenuButton
                    width="100%"
                    height="100%"
                    as={Button}
                    rightIcon={ <AddIcon/> }
                    onClick={getOptions}
                >
                    Add Node
                </MenuButton>
                <MenuList>
                    {types.map(t => <MenuItem onClick={() => addNode(t)}>{t}</MenuItem>)}
                </MenuList>
            </Menu>
        </Box>
    );
}