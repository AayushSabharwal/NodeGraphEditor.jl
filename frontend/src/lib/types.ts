import { ComponentChildren } from "preact"
import { NodeGraph } from "~/src/NodeGraph/NodeGraph"

// #region Utilities
export type Vec2 = {
    x: number,
    y: number,
}

export enum ConnectorType {
    input = 0,
    output = 1,
}
// #endregion

// #region Nodes and Edges
export interface NodeData {
    node_id: number,
    node_name: string,
    pos: Vec2,
    size: Vec2,
    inputs: number,
    outputs: number,
    params: Record<string, any>,
}

export type Edge = {
    from: number,
    from_type: ConnectorType,
    from_conn: number,
    to: number,
    to_type: ConnectorType,
    to_conn: number,
}
// #endregion

// #region NodeGraph Props and States

export interface StageProps {
    width: number,
    height: number,
    graph: NodeGraph,
    dragNode: (ind: number, pos: Vec2) => void,
    onNodeDragEnd: (ind: number) => void,
    addEdge: (edge: Edge) => void,
    deleteEdge: (edge: Edge) => void,
    selectNode: (id: number) => void,
    selection: number,
}

export interface StageState {
    isdragging: boolean,
    dragging_ind: number,
    dragstart: Vec2,
    node_dragstart: Vec2,
    isconnecting: boolean,
    connection: {
        from: number,
        type: ConnectorType,
        conn: number,
    },
    ispanning: boolean,
    panstart: Vec2,
    vp_panstart: Vec2,
    viewport: {
        pos: Vec2,
        zoom: number,
    },
}
// #endregion
