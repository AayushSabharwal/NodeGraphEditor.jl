import { Colors } from "@blueprintjs/core";
import { Capacitance, Inductance, Resistance, VoltageSource, SourceType } from "./types";

export const DRAG_BUTTON = 0;
export const PAN_BUTTON = 2;
export const CONN_SIDE_MARGIN = 10;
export const CONN_RADIUS = 7.5;
export const CONN_Y_SPACING = 10;
export const MAX_ZOOM = 2;
export const MIN_ZOOM = 0.25;
export const ZOOM_SPEED = 1 / 1250;
export const DIVIDER_WIDTH = 10;
export const NODE_MIN_WIDTH = 150;
export const NODE_MAX_WIDTH = 300;
export const NODE_CHAR_WIDTH = 10;
export const NODE_LINE_HEIGHT = 19;
export const IMAGE_SIZE = { x: 100, y: 100 };
export const INPUT_WIDTH = 400;
export const LABEL_WIDTH = 140;
export const UNIT_WIDTH = 15;
export const LINE_MAX_BEZIER_OFFSET = 70;
export const CONN_IN_COLORS = [
    Colors.VERMILION4,
    Colors.GREEN3,
    Colors.COBALT3,
];
export const CONN_OUT_COLORS = [
    Colors.ORANGE4,
    Colors.FOREST4,
    Colors.INDIGO3,
]
export const IMAGE_ASPECT_RATIOS = {
    VoltageSource: 1,
    Resistance: 6.8 / 2.8,
    Capacitance: 35 / 16,
    Inductance: 2,
}
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
    source_type: SourceType.Constant,
    offset: 0,
    frequency: 1,
    starttime: 0,
    phase: 0,
    damping_coef: 0,
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