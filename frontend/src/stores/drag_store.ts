import { writable } from "svelte/store";
import type { DragState } from "../types";

export function getDragStore() {
    const { subscribe, update, set } = writable<DragState>({
        drag_type: null,
        drag_name: "",
        drag_offset: [0, 0],
        drag_callback: undefined,
    });

    function startDrag(drag: DragState) {
        if (drag.drag_type === null) return;
        update(old => {
            if (old.drag_type !== null) return old;

            return drag;
        });
    }

    function stopDrag() {
        set({
            drag_type: null,
            drag_name: "",
            drag_offset: [0, 0],
            drag_callback: undefined,
        });
    }

    return {
        subscribe,
        startDrag,
        stopDrag,
    };
}

export const dragstate = getDragStore();
