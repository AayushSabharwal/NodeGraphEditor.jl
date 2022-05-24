import { writable } from "svelte/store";
import { MAX_ZOOM, MIN_ZOOM } from "../constants";
import type { ViewportState } from "../types";

export function getViewportStore() {
    const { subscribe, update, set } = writable<ViewportState>({
        position: [0, 0],
        zoom: 1,
    });

    function dragViewport(target: number[]) {
        if (target.length !== 2) return;
        update(old => ({
            ...old,
            position: [old.position[0] - target[0], old.position[1] - target[1]],
        }));
    }

    function setPosition(pos: number[]) {
        if (pos.length !== 2) return;
        update(old => ({
            ...old,
            position: pos,
        }));
    }

    function zoom(delta: number, pageFocus: number[]) {
        if (pageFocus.length !== 2) return;

        update(old => {
            const newZoom = Math.max(
                MIN_ZOOM,
                Math.min(MAX_ZOOM, Math.round((old.zoom + delta) * 10) / 10)
            );
            if (newZoom === old.zoom) return old;
            const positionFactor = 1 / old.zoom - 1 / (old.zoom + delta);
            return {
                zoom: newZoom,
                position: [
                    old.position[0] + pageFocus[0] * positionFactor,
                    old.position[1] + pageFocus[1] * positionFactor,
                ],
            };
        });
    }

    return { subscribe, dragViewport, setPosition, zoom };
}

export const viewport = getViewportStore();
