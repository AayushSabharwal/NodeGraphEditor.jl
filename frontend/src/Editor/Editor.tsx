import './Editor.scss';
import { NodeMenu } from "~/src/Editor/NodeMenu";
import { Box } from "@chakra-ui/react";
import { AddNodeButton } from "~/src/Editor/AddNode";


export function Editor() {
    return (
        <Box className="rightpanel">
            <AddNodeButton/>
            <NodeMenu/>
        </Box>
    );
}