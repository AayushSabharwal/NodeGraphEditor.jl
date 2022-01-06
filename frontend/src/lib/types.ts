import { NodeGraph } from "~/src/NodeGraph/NodeGraph"
import React, { ReactNode } from "react"

// #region Utilities
export type Vec2 = {
    x: number,
    y: number,
}

export enum ConnectorType {
    input = 0,
    output = 1,
}

export type Err = {
    err: string,
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
export interface NodeProps extends NodeData {
    selected: boolean,
    onConnectorMouseUp: (id: number, type: ConnectorType, conn: number, e: MouseEvent) => void,
    onConnectorMouseDown: (id: number, type: ConnectorType, conn: number, e: MouseEvent) => void,
    onMouseDown: (e: MouseEvent) => void,
}

export interface StageProps {
    width: number,
    height: number,
    graph: NodeGraph,
    dragNode: (ind: number, pos: Vec2) => void,
    onNodeDragEnd: (ind: number) => void,
    addEdge: (edge: Edge) => void,
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

// #region Editor Menu
export interface EditorState {
    stagewidth: number,
    graph: NodeGraph,
    selected: number,
}

export interface NodeMenuProps {
    node: NodeData | undefined,
    updateNode: (ind: number, key: string, value: any) => void,
    updateNodeParams: (id: number, key: string, value: any) => void,
    deleteNode: (id: number) => void,
}

export interface NodeMenuRendererProps {
    params: Record<string, any>,
    node_id: number,
    onChangeParams: (id: number, key: string, value: any) => void,
}

export interface NumberInputWrapperProps {
    value: number,
    unit?: ReactNode,
    onChange: (value: number) => void,
}

export interface NumberInputWrapperState {
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