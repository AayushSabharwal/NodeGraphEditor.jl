import { NodeGraph } from "NodeGraph/NodeGraph"
import React, { ReactNode } from "react"

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
    node_name: string,
    pos: Vec2,
    size: Vec2,
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
    stagewidth: number,
    graph: NodeGraph,
    newnode_id: number,
}

export interface NodeMenuProps {
    nodes: NodeData[],
    updateNode: (ind: number, node: NodeData) => void,
    updateNodeParams: (ind: number, params: NodeType) => void,
    deleteNode: (id: number) => void,
}

export interface NodeMenuRendererProps<T extends NodeType> {
    params: T,
    node_id: number,
    onChangeParams: (id: number, params: T) => void,
}

export interface KVPProps {
    label: string,
    value: number,
    unit?: ReactNode,
    onChange: (value: number) => void,
}

export interface KVPState {
    temp_value: string,
    invalid: boolean,
}

export interface DropdownButtonProps {
    width?: string | number,
    button_name: string,
    options: string[],
    onSelect: (opt: string) => void,
}

export interface DropdownButtonState {
    isopen: boolean,
}

export interface ControlledTextFieldProps {
    label: string,
    submitChange: (value: string) => void,
    width?: string,
    height?: string,
}

export interface ControlledTextFieldState {
    focused: boolean,
}

export interface NodeCardProps {
    label: string,
    changeLabel: (value: string) => void,
    deleteNode: () => void,
}

export interface NodeCardState {
    isOpen: boolean,
}

export interface DropdownSelectorProps {
    width?: string | number,
    selected: number,
    options: string[],
    onSelect: (ind: number) => void,
}
// #endregion

// #region Component types
export enum SourceType {
    Constant = 0,
    Sine = 1,
    Cosine = 2,
    DampedSine = 3,
}

export type VoltageSource = {
    type: "VoltageSource",
    inputs: 1,
    outputs: 1,
    voltage: number,
    source_type: SourceType,
    offset: number,
    frequency: number,
    starttime: number,
    phase: number,
    damping_coef: number,
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