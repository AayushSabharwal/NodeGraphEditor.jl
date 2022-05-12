export type MyNode = {
    id: number;
    name: string;
    inputs: number;
    outputs: number;
    position: number[];
    properties: { [key: string]: any };
};

export type ConnectorType = "input" | "output";

export type MyConnector = {
    node: number;
    type: ConnectorType;
    index: number;
};

export type MyEdge = {
    src: MyConnector;
    dst: MyConnector;
};

export type NodeGraph = {
    nodes: { [key: number]: MyNode };
    edges: MyEdge[];
};

export type DragType = "node" | "connector" | "stage";

export type DragState = {
    drag_type: DragType | null;
    drag_name: any;
    drag_offset: number[];
    drag_callback: (e: MouseEvent) => void | undefined;
};

export type ViewportState = {
    position: number[];
    zoom: number;
};

export type PositionsState = {
    [node: number]: {
        input: { [index: number]: number[] };
        output: { [index: number]: number[] };
    };
};
