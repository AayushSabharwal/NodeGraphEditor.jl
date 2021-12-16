export type Vec2 = {
    x: number,
    y: number,
}

export type ConnectorType = "input" | "output"

export interface NodeData {
    node_id: number,
    pos: Vec2,
    size: Vec2,
    inputs: number,
    outputs: number,
}

export type Edge = {
    from: number,
    from_type: ConnectorType,
    from_conn: number,
    to: number,
    to_type: ConnectorType,
    to_conn: number,
}

export interface NodeProps extends NodeData, React.SVGAttributes<SVGGElement> {
    selected: boolean,
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
    }
    selected: number,
}

export interface EditorState {
    nodes: NodeData[],
    edges: Edge[],
    stagewidth: number,
}