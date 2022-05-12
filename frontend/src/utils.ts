import type { MyConnector, MyEdge } from "./types";

export function identicalConnector(a: MyConnector, b: MyConnector) {
    return a.node === b.node && a.type === b.type && a.index === b.index;
}

export function identicalEdge(a: MyEdge, b: MyEdge) {
    return (
        (identicalConnector(a.src, b.src) && identicalConnector(a.dst, b.dst)) ||
        (identicalConnector(a.src, b.dst) && identicalConnector(a.dst, b.src))
    );
}
