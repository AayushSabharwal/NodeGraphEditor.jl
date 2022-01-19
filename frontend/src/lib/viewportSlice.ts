import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MAX_ZOOM, MIN_ZOOM, ZOOM_SPEED } from "./constants";
import { RootState } from "./store";
import { Vec2 } from "./types";

export type Viewport = {
    size: Vec2
    pos: Vec2
    zoom: number
}

const initialState: Viewport = {
    size: { x: 0, y: 0 },
    pos: { x: 0, y: 0 },
    zoom: 1,
}
function zoomToReducer(
    state: Viewport,
    { payload }: PayloadAction<{zoom: number, focus: Vec2}>
) {
    const { zoom, focus } = payload;
    const new_zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom));

    state.pos = {
        x: state.pos.x + focus.x * (1 / state.zoom - 1 / new_zoom),
        y: state.pos.y + focus.y * (1 / state.zoom - 1 / new_zoom),
    };
    state.zoom = new_zoom;
}

function zoomInReducer(state: Viewport) {
    zoomToReducer(state, {
        type: 'viewport/zoomIn',
        payload: {
            zoom: state.zoom + ZOOM_SPEED,
            focus: vpCenter(state)
        }
    });
}

function zoomOutReducer(state: Viewport) {
    zoomToReducer(state, {
        type: 'viewport/zoomOut',
        payload: {
            zoom: state.zoom - ZOOM_SPEED,
            focus: vpCenter(state)
        }
    });
}

export const viewportSlice = createSlice({
    name: 'viewport',
    initialState,
    reducers: {
        zoomTo: zoomToReducer,
        zoomIn: zoomInReducer,
        zoomOut: zoomOutReducer,
        moveViewport(state, { payload }: PayloadAction<Vec2>) {
            state.pos = payload;
        },
        resizeViewport(state, { payload }: PayloadAction<Vec2>) {
            state.size = payload;
        }
    }
});

export const { zoomTo, zoomIn, zoomOut, moveViewport, resizeViewport } = viewportSlice.actions;

export const vpSizeSelector = () => (state: RootState) => state.viewport.size;

export const vpPosSelector = () => (state: RootState) => state.viewport.pos;

export const vpZoomSelector = () => (state: RootState) => state.viewport.zoom;

export const vpSelector = () => (state: RootState) => state.viewport;

export const vpCenter = (state: Viewport) => ({
    x: state.pos.x + 0.35 * state.size.x / state.zoom,
    y: state.pos.y + 0.35 * state.size.y / state.zoom,
})

export const vpIntersects = (state: Viewport, min: Vec2, max: Vec2) =>
    min.x <= state.pos.x + state.size.x / state.zoom && max.x >= state.pos.x &&
    min.y <= state.pos.y + state.size.y / state.zoom && max.y >= state.pos.y;
