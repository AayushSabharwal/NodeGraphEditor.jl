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
}

export type Edge = {
    from: number,
    from_type: ConnectorType,
    from_conn: number,
    to: number,
    to_type: ConnectorType,
    to_conn: number,
}

export type Graph = {
    nodes: NodeData[]
    edges: Edge[]
}
// #endregion
