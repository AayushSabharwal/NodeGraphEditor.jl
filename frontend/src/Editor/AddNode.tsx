import { Box, Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { useState } from "preact/hooks";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import "./AddNode.scss"
import { useDispatch } from "react-redux";
import { addNode } from "../lib/graphSlice";

export function AddNodeButton() {
    const [types, setTypes] = useState<string[]>([]);

    const dispatch = useDispatch();

    const buttonClick = (type: string) => {
        console.log("C");
        dispatch(addNode(type));
    }

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
                    {types.map(t => <MenuItem onClick={() => buttonClick(t)}>{t}</MenuItem>)}
                </MenuList>
            </Menu>
        </Box>
    );
}