import React from "react"

// #region Utilities
export type Vec2 = {
    x: number,
    y: number,
}

export type ConnectorType = "input" | "output"
// #endregion

// #region Nodes and Edges
export interface NodeData {
    node_id: number,
    pos: Vec2,
    size: Vec2,
    selected: boolean,
    params: NodeType,
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
export interface NodeProps extends NodeData, React.SVGAttributes<SVGGElement> {
    onConnectorMouseUp: (id: number, type: ConnectorType, conn: number, e: React.MouseEvent) => void,
    onConnectorMouseDown: (id: number, type: ConnectorType, conn: number, e: React.MouseEvent) => void,
}

export interface StageProps {
    width: number,
    height: number,
    nodes: NodeData[],
    edges: Edge[],
    updateNode: (ind: number, node: NodeData) => void,
    addEdge: (edge: Edge) => void,
    selectNode: (ind: number) => void,
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

// #region Editor Menu
export interface EditorState {
    nodes: NodeData[],
    edges: Edge[],
    stagewidth: number,
    selected: number,
    newnode_id: number,
}

export interface NodeMenuRendererProps<T extends NodeType> {
    params: T,
    node_id: number,
    onChangeParams: (id: number, params: T) => void,
}

export interface KVPProps {
    keyname: string,
    value: number,
    submitChange: (value: number) => void,
}

export interface KVPState {
    temp_value: string,
}

export interface DropdownButtonProps {
    width?: number,
    button_name: string,
    options: string[],
    onSelect: (opt: string) => void,
}

export interface DropdownButtonState {
    isopen: boolean,
}
// #endregion

// #region Component types
export type VoltageSource = {
    type: "VoltageSource",
    inputs: 1,
    outputs: 1,
    voltage: number,
}

export type Resistance = {
    type: "Resistance",
    inputs: 1,
    outputs: 1,
    resistance: number,
}

export type Inductance = {
    type: "Inductance",
    inputs: 1,
    outputs: 1,
    inductance: number,
}

export type Capacitance = {
    type: "Capacitance",
    inputs: 1,
    outputs: 1,
    capacitance: number,
}

export type NodeType = VoltageSource | Resistance | Capacitance | Inductance;
// #endregion