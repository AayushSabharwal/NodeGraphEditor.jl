import { useState } from "react";
import { DRAG_BUTTON } from "~/src/lib/constants";
import { ConnectorType, NodeData, Vec2 } from "~/src/lib/types";
import { Node } from "~/src/NodeGraph/Node";
import { Connection } from "./Connection";
import { calculateConnectorX, calculateConnectorY } from "~/src/NodeGraph/Connector";
import { useDispatch, useSelector } from "react-redux";
import { addEdge, dragNode, graphSelector, nodeSelector, updateNode } from "../lib/graphSlice";
import { idSelector, setSelected } from "../lib/editorSlice";
import store from "../lib/store";
import { useCallback } from "preact/hooks";
import { vpPosSelector, vpSizeSelector, vpZoomSelector } from "../lib/viewportSlice";


type HalfConnection = {
    from: number
    type: ConnectorType
    conn: number
}

export function NodeLayer() {
    const graph = useSelector(graphSelector());
    const dispatch = useDispatch();
    
    // #region Node Dragging
    const onNodeMouseDown = (id: number, e: MouseEvent) => {
        if (e.button !== DRAG_BUTTON)
            return;

        dispatch(setSelected(id));
        const node = nodeSelector(id)(store.getState());
    
        if(!node)
            return;
    
        const dragStart = { x: e.pageX, y: e.pageY };
        const nodeDragStart = { x: node.pos.x, y: node.pos.y };
        
        const onNodeMouseMove = (e: MouseEvent) => {
            const id = idSelector()(store.getState());
            if(id === -1) {
                return;
            }
    
            dispatch(dragNode({
                id,
                pos: {
                    x: nodeDragStart.x + (e.pageX - dragStart.x) / vpZoomSelector()(store.getState()),
                    y: nodeDragStart.y + (e.pageY - dragStart.y) / vpZoomSelector()(store.getState()),
                }
            }));
    
            e.stopPropagation();
            e.preventDefault();
        }
    
        const onNodeMouseUp = (e: MouseEvent) => {
            const id = idSelector()(store.getState());
    
            if (e.button !== DRAG_BUTTON || id === -1)
                return;
    
            document.removeEventListener('mousemove', onNodeMouseMove);
            document.removeEventListener('mouseup', onNodeMouseUp);
            e.stopPropagation();
            e.preventDefault();
    
            const node = nodeSelector(id)(store.getState());
            if (!node)
                return;
            
            dispatch(updateNode({
                id,
                key: 'pos',
                value: node.pos
            }));
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

        dispatch(addEdge({
            from: connection.from,
            from_type: connection.type,
            from_conn: connection.conn,
            to: parent_id,
            to_type: type,
            to_conn: conn,
        }));
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
    const node = connection && useSelector(nodeSelector(connection.from));
    if (node) {
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
            x: dragPos.x / vpZoomSelector()(store.getState()) + vpPosSelector()(store.getState()).x,
            y: dragPos.y / vpZoomSelector()(store.getState()) + vpPosSelector()(store.getState()).y + 2,
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
    const nodeInViewport = (node: NodeData) => {
        return node.pos.x <= vpPosSelector()(store.getState()).x + vpSizeSelector()(store.getState()).x / vpZoomSelector()(store.getState()) &&
            node.pos.x + node.size.x >= vpPosSelector()(store.getState()).x &&
            node.pos.y <= vpPosSelector()(store.getState()).y + vpSizeSelector()(store.getState()).y / vpZoomSelector()(store.getState()) &&
            node.pos.y + node.size.y >= vpPosSelector()(store.getState()).y;
    }

    const selected = useSelector(idSelector());

    return (
        <>
            {graph.nodes
                .filter(nodeInViewport)
                .map(node => (
                    <Node
                        key={node.node_id}
                        {...node}
                        selected={selected === node.node_id}
                        onMouseDown={e => onNodeMouseDown(node.node_id, e)}
                        onConnectorMouseDown={onConnectorMouseDown}
                        onConnectorMouseUp={onConnectorMouseUp}
                    />
            ))}
            {connline}
        </>
    );
}