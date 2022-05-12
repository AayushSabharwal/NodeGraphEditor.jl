import { writable } from "svelte/store";
import type { MyConnector, NodeGraph } from "../types";
import { identicalEdge } from "../utils";

export function createGraphStore() {
    const { subscribe, update, set } = writable<NodeGraph>({
        nodes: {
            0: {
                id: 0,
                name: "a",
                inputs: 2,
                outputs: 1,
                position: [0, 0],
                properties: { p: 0, q: 0 },
            },
            1: {
                id: 1,
                name: "b",
                inputs: 1,
                outputs: 1,
                position: [50, 50],
                properties: { p: 0, q: 0 },
            },
        },
        edges: [
            {
                src: { node: 0, type: "output", index: 0 },
                dst: { node: 1, type: "input", index: 0 },
            },
        ],
    });

    function dragNodeTo(id: number, target: number[]) {
        if (target.length != 2) return;
        update(old => {
            if (!(id in old.nodes)) return old;

            return {
                ...old,
                nodes: {
                    ...old.nodes,
                    [id]: {
                        ...old.nodes[id],
                        position: [target[0], target[1]],
                    },
                },
            };
        });
    }

    function addEdge(from: MyConnector, to: MyConnector) {
        if (from.node === to.node) return;

        update(old => {
            const new_edge = { src: from, dst: to };
            if (!(from.node in old.nodes) || !(to.node in old.nodes)) return old;
            if (old.edges.find(e => identicalEdge(e, new_edge)) !== undefined) return old;
            return { ...old, edges: [...old.edges, new_edge] };
        });
    }

    return {
        subscribe,
        dragNodeTo,
        addEdge,
    };
}

export const nodegraph = createGraphStore();
