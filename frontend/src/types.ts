export type MyNode = {
    name: string;
    inputs: number;
    outputs: number;
    position: number[];
    properties: { [key: string]: any };
};

export type NodeGraph = {
    nodes: { [key: string]: MyNode };
    graph: { [key: string]: string[] };
};

export type DragType = "node" | "connector" | "stage";

export type DragState = {
    drag_type: DragType | null;
    drag_name: string;
    drag_offset: number[];
    drag_callback: (e: MouseEvent) => void | undefined;
};

export type ViewportState = {
    position: number[],
    zoom: number,
}
