import { ConnectorType, Vec2 } from "~/src/lib/types";
import {
    CONN_IN_COLORS,
    CONN_OUT_COLORS,
    LINE_MAX_BEZIER_OFFSET,
} from "~/src/lib/constants";

export interface ConnectionProps {
    from: Vec2;
    from_type: ConnectorType;
    from_ind: number;
    to: Vec2;
    to_type: ConnectorType;
    to_ind: number;
    onClick?: () => void;
}

export function Connection(props: ConnectionProps) {
    const { from, to, from_type, to_type, from_ind, to_ind } = props;
    const from_off =
        (from_type === ConnectorType.input ? -1 : 1) * LINE_MAX_BEZIER_OFFSET;
    const to_off = (to_type === ConnectorType.input ? -1 : 1) * LINE_MAX_BEZIER_OFFSET;
    const c1 = {
        x: from.x + from_off,
        y: from.y,
    };
    const c2 = {
        x: to.x + to_off,
        y: to.y,
    };
    const col1 =
        from_type === ConnectorType.input
            ? CONN_IN_COLORS[(from_ind - 1) % CONN_IN_COLORS.length]
            : CONN_OUT_COLORS[(from_ind - 1) % CONN_OUT_COLORS.length];
    const col2 =
        to_type === ConnectorType.input
            ? CONN_IN_COLORS[(to_ind - 1) % CONN_IN_COLORS.length]
            : CONN_OUT_COLORS[(to_ind - 1) % CONN_OUT_COLORS.length];
    return (
        <g>
            <defs>
                <linearGradient id={`${from_type}${from_ind}${to_type}${to_ind}`}>
                    <stop offset="5%" stopColor={to.x > from.x ? col1 : col2} />
                    <stop offset="95%" stopColor={to.x > from.x ? col2 : col1} />
                </linearGradient>
            </defs>
            <path
                onClick={props.onClick}
                d={`M ${from.x} ${from.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${to.x} ${to.y}`}
                fill="transparent"
                stroke={`url(#${from_type}${from_ind}${to_type}${to_ind})`}
                strokeWidth={2}
            />
        </g>
    );
}
