import './Editor.scss';
import { NodeMenu } from "~/src/Editor/NodeMenu";
import { Box } from "@chakra-ui/react";
import { AddNodeButton } from "~/src/Editor/AddNode";
import { NodeGraph } from "~/src/NodeGraph/NodeGraph";

export interface EditorProps {
    graph: NodeGraph
    selected: number
    addNode: (type: string) => void
    updateNode: (id: number, key: string, value: any) => void
    updateNodeParams: (id: number, key: string, value: any) => void
    deleteNode: (id: number) => void
}

export function Editor(props: EditorProps) {
    return (
        <Box className="rightpanel">
            <AddNodeButton addNode={props.addNode}/>
            <NodeMenu
                node={props.graph.findNode(props.selected)}
                updateNode={props.updateNode}
                updateNodeParams={props.updateNodeParams}
                deleteNode={props.deleteNode}
            />
        </Box>
    );
}