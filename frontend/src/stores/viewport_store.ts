import { writable } from "svelte/store";
import type { ViewportState } from "../types";

export function getViewportStore() {
    const { subscribe, update, set } = writable<ViewportState>({
        position: [0, 0],
        zoom: 1,
    });

    function dragViewport(target: number[]) {
        if (target.length != 2) return;
        update(old => ({ ...old, position: [old.position[0] - target[0], old.position[1] - target[1]] }));
    }

    return { subscribe, dragViewport };
}

export const viewport = getViewportStore();
