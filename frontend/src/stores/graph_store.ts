import { writable } from "svelte/store";
import type { NodeGraph } from "../types";

export function createGraphStore() {
    const { subscribe, update, set } = writable<NodeGraph>({
        nodes: {
            a: {
                name: "a",
                inputs: 1,
                outputs: 1,
                position: [0, 0],
                properties: { p: 0, q: 0 },
            },
        },
        graph: {
            a_i_1: [],
            a_o_1: [],
        },
    });

    function dragNodeTo(name: string, target: number[]) {
        if (target.length != 2) return;
        update(old => {
            if (!(name in old.nodes)) return old;

            return {
                ...old,
                nodes: {
                    ...old.nodes,
                    [name]: {
                        ...old.nodes[name],
                        position: [
                            target[0],
                            target[1],
                        ],
                    },
                },
            };
        });
    }

    return {
        subscribe,
        dragNodeTo,
    };
}

export const nodegraph = createGraphStore();
