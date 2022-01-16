import { useState } from "react";
import { DRAG_BUTTON } from "~/src/lib/constants";
import { ConnectorType, Edge, Vec2 } from "~/src/lib/types";
import { Node } from "~/src/NodeGraph/Node";
import { NodeGraph } from "~/src/NodeGraph/NodeGraph";
import { Connection } from "./Connection";
import { calculateConnectorX, calculateConnectorY } from "~/src/NodeGraph/Connector";


type HalfConnection = {
    from: number
    type: ConnectorType
    conn: number
}

export interface NodeLayerProps {
    graph: NodeGraph
    selected: number
    viewportPos: Vec2
    zoom: number
    selectNode: (id: number) => void
    dragNode: (id: number, pos: Vec2) => void,
    onNodeDragEnd: (ind: number) => void
    addEdge: (edge: Edge) => void
}

export function NodeLayer(props: NodeLayerProps) {
    // #region Node Dragging

    const onNodeMouseDown = (id: number, e: MouseEvent) => {
        if (e.button !== DRAG_BUTTON)
            return;

        props.selectNode(id);
        const node = props.graph.findNode(id);
        if(!node)
            return;
        
        const dragStart = { x: e.pageX, y: e.pageY };
        const nodeDragStart = { x: node.pos.x, y: node.pos.y };
        
        const onNodeMouseMove = (e: MouseEvent) => {
            if(id === -1) {
                return;
            }
    
            props.dragNode(id, {
                x: nodeDragStart.x + (e.pageX - dragStart.x) * props.zoom,
                y: nodeDragStart.y + (e.pageY - dragStart.y) * props.zoom,
            });
    
            e.stopPropagation();
            e.preventDefault();
        }
    
        const onNodeMouseUp = (e: MouseEvent) => {
            if (e.button !== DRAG_BUTTON || id === -1)
                return;
    
            props.onNodeDragEnd(id);
            
            document.removeEventListener('mousemove', onNodeMouseMove);
            document.removeEventListener('mouseup', onNodeMouseUp);
            e.stopPropagation();
            e.preventDefault();
        }

        document.addEventListener('mousemove', onNodeMouseMove);
        document.addEventListener('mouseup', onNodeMouseUp);


        e.stopPropagation();
        e.preventDefault();
    }

    // #endregion

    // #region ConnectorDragging
    const [connection, setConnection] = useState<HalfConnection | undefined>(undefined);
    const [dragPos, setDragPos] = useState<Vec2>({ x: 0, y: 0 });

    const stopConnecting = () => {
        setConnection(undefined);
        document.removeEventListener('mousemove', onConnectorMouseMove);
        document.removeEventListener('mouseup', onNotConnectorMouseUp);
    }

    const onConnectorMouseDown = (
        parent_id: number,
        type: ConnectorType,
        conn: number,
        e: MouseEvent
    ) => {
        if (e.button !== DRAG_BUTTON)
            return;
        
        setConnection({
            from: parent_id,
            type,
            conn,
        });

        setDragPos({ x: e.pageX, y: e.pageY });

        document.addEventListener('mousemove', onConnectorMouseMove);
        document.addEventListener('mouseup', onNotConnectorMouseUp);
        
        e.stopPropagation();
        e.preventDefault();
    }

    const onConnectorMouseMove = (e: MouseEvent) => {
        setDragPos({
            x: e.pageX,
            y: e.pageY,
        });

        e.stopPropagation();
        e.preventDefault();
    }

    const onConnectorMouseUp = (
        parent_id: number,
        type: ConnectorType,
        conn: number,
        e: MouseEvent
    ) => {
        if (e.button !== DRAG_BUTTON || !connection || parent_id === connection.from) {
            setConnection(undefined)
            e.preventDefault();
            return;
        }

        props.addEdge({
            from: connection.from,
            from_type: connection.type,
            from_conn: connection.conn,
            to: parent_id,
            to_type: type,
            to_conn: conn,
        });
        stopConnecting();

        e.preventDefault();
    }

    const onNotConnectorMouseUp = (e: MouseEvent) => {
        if (e.button !== DRAG_BUTTON)
            return;
        
        stopConnecting();
        
        e.stopPropagation();
        e.preventDefault();
    }

    let connline = null;
    if (connection) {
        const node = props.graph.nodes[props.graph.findNodeIndex(connection.from)];
        const from = {
            x: node.pos.x + calculateConnectorX(
                node.size,
                connection.type,
            ),
            y: node.pos.y + calculateConnectorY(
                connection.conn,
            ),
        };
        const to = {
            x: dragPos.x * props.zoom + props.viewportPos.x,
            y: dragPos.y * props.zoom + props.viewportPos.y + 2,
        };
        connline = <Connection
            from={from}
            from_type={connection.type}
            from_ind={connection.conn}
            to={to}
            to_type={to.x > from.x ? ConnectorType.input : ConnectorType.output}
            to_ind={1}
        />
    }
    // #endregion
    return (
        <>
            {props.graph.nodes.map(node => (
                <Node
                    key={node.node_id}
                    {...node}
                    selected={props.selected === node.node_id}
                    onMouseDown={e => onNodeMouseDown(node.node_id, e)}
                    onConnectorMouseDown={onConnectorMouseDown}
                    onConnectorMouseUp={onConnectorMouseUp}
                />
            ))}
            {connline}
        </>
    );
}