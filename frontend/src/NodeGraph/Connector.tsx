import { CONN_IN_COLORS, CONN_OUT_COLORS, CONN_RADIUS, CONN_SIDE_MARGIN, CONN_Y_SPACING } from "~/src/lib/constants";
import { ConnectorType, NodeData, Vec2 } from "~/src/lib/types";
import "./Connector.scss"

export function calculateConnectorX(parent_size: Vec2, type: ConnectorType) {
    if (type === ConnectorType.input)
        return CONN_RADIUS + CONN_SIDE_MARGIN;
    else
        return parent_size.x - (CONN_RADIUS + CONN_SIDE_MARGIN);
}

export function calculateConnectorY(index: number) {
    return (index - 1) * (2 * CONN_RADIUS + CONN_Y_SPACING) + CONN_RADIUS + CONN_Y_SPACING;
}

export interface ConnectorProps {
    index: number
    type: ConnectorType
    parent: NodeData
    onConnectorMouseDown: (
        id: number,
        type: ConnectorType,
        conn: number,
        e: MouseEvent
    ) => void
    onConnectorMouseUp: (
        id: number,
        type: ConnectorType,
        conn: number,
        e: MouseEvent
    ) => void
}

export function Connector(props: ConnectorProps) {
    const colors = props.type === ConnectorType.input ? CONN_IN_COLORS : CONN_OUT_COLORS;
    return (
        <circle
            className="Connector"
            style={{
                fill: colors[props.index % colors.length]
            }}
            cx={calculateConnectorX(props.parent.size, props.type)}
            cy={calculateConnectorY(props.index + 1)}
            onMouseDown={e => props.onConnectorMouseDown(
                props.parent.node_id,
                props.type,
                props.index + 1,
                e,
            )}
            onMouseUp={e => props.onConnectorMouseUp(
                props.parent.node_id,
                props.type,
                props.index + 1,
                e,
            )}
        />
    );
}