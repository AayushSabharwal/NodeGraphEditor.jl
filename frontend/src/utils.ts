import type { MyConnector, MyEdge, PositionsState } from "./types";

export function identicalConnector(a: MyConnector, b: MyConnector) {
    return a.node === b.node && a.type === b.type && a.index === b.index;
}

export function identicalEdge(a: MyEdge, b: MyEdge) {
    return (
        (identicalConnector(a.src, b.src) && identicalConnector(a.dst, b.dst)) ||
        (identicalConnector(a.src, b.dst) && identicalConnector(a.dst, b.src))
    );
}

export function connectorPositionExists(pos: PositionsState, conn: MyConnector) {
    return (
        conn.node in pos &&
        conn.type in pos[conn.node] &&
        ![null, undefined].includes(pos[conn.node][conn.type][conn.index])
    );
}
