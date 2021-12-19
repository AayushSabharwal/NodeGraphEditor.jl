import { Capacitance, Inductance, Resistance, VoltageSource } from "./types";

export const DRAG_BUTTON = 0;
export const PAN_BUTTON = 2;
export const CONN_SIDE_MARGIN = 5;
export const CONN_RADIUS = 7.5;
export const CONN_Y_SPACING = 10;
export const MAX_ZOOM = 2;
export const MIN_ZOOM = 0.25;
export const ZOOM_SPEED = 1 / 1250;
export const DIVIDER_WIDTH = 10;
export const DefaultNodeData = {
    pos: { x: 0, y: 0 },
    size: { x: 150, y: 75 },
    edges: [],
    selected: false,
};
export const DefaultVoltageSource: VoltageSource = {
    type: "VoltageSource",
    inputs: 1,
    outputs: 1,
    voltage: 1,
}
export const DefaultResistance: Resistance = {
    type: "Resistance",
    inputs: 1,
    outputs: 1,
    resistance: 1,
}

export const DefaultCapacitance: Capacitance = {
    type: "Capacitance",
    inputs: 1,
    outputs: 1,
    capacitance: 1,
}

export const DefaultInductance: Inductance = {
    type: "Inductance",
    inputs: 1,
    outputs: 1,
    inductance: 1,
}