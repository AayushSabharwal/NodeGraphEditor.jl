import './Node.scss'
import { CONN_IN_COLORS, CONN_OUT_COLORS, CONN_RADIUS, CONN_SIDE_MARGIN, CONN_Y_SPACING, NODE_BORDER, NODE_CHAR_WIDTH, NODE_LINE_HEIGHT, NODE_MAX_WIDTH, NODE_MIN_WIDTH } from '~/src/lib/constants';
import { Vec2, ConnectorType, NodeData } from '~/src/lib/types';

export function calculateConnectorX(parent_size: Vec2, type: ConnectorType) {
    if (type === ConnectorType.input)
        return CONN_RADIUS + CONN_SIDE_MARGIN;
    else
        return parent_size.x - (CONN_RADIUS + CONN_SIDE_MARGIN);
}

export function calculateConnectorY(index: number) {
    return (index - 1) * (2 * CONN_RADIUS + CONN_Y_SPACING) + CONN_RADIUS + CONN_Y_SPACING;
}

export function wrappedContentString(content: string): string[] {
    const maxchars = Math.floor(NODE_MAX_WIDTH / NODE_CHAR_WIDTH);
    if (content.length <= maxchars)
        return [content];
    let i = maxchars;
    let ret = [content.slice(0, i)];
    while (i < content.length) {
        ret.push(content.slice(i, Math.min(i + maxchars, content.length)));
        i += maxchars;
    }
    return ret;
}

export function wrappedContentStringLines(content: string): number {
    const maxchars = Math.floor(NODE_MAX_WIDTH / NODE_CHAR_WIDTH);
    return Math.ceil(content.length / maxchars);
}

export function calculateNodeSize(node: NodeData): Vec2 {
    const conn = Math.max(node.inputs, node.outputs);
    return {
        x: Math.min(
            Math.max(
                node.node_name.length * NODE_CHAR_WIDTH,
                NODE_MIN_WIDTH
            ),
            NODE_MAX_WIDTH
        ) + 2 * (2 * CONN_RADIUS + CONN_Y_SPACING),
        y: Math.max(
            conn * (2 * CONN_RADIUS + CONN_Y_SPACING) - CONN_Y_SPACING,
            NODE_LINE_HEIGHT * wrappedContentStringLines(node.node_name),
        ) + 2 * CONN_Y_SPACING,
    }
}

export interface NodeProps extends NodeData {
    selected: boolean,
    onConnectorMouseUp: (id: number, type: ConnectorType, conn: number, e: MouseEvent) => void,
    onConnectorMouseDown: (id: number, type: ConnectorType, conn: number, e: MouseEvent) => void,
    onMouseDown: (e: MouseEvent) => void
}

export function Node(props: NodeProps) {
    const { node_id, pos, size } = props;
    return (
        <svg
            id={"node_" + node_id}
            width={size.x}
            height={size.y}
            x={pos.x}
            y={pos.y}
            onMouseDown={props.onMouseDown}
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect className="NodeBorder" width={size.x} height={size.y}/>
            <rect
                className="Node"
                width={size.x - NODE_BORDER}
                height={size.y - NODE_BORDER}
                x={NODE_BORDER / 2}
                y={NODE_BORDER / 2}
            />
            {Array(props.inputs).fill(1).map((_, i) =>
                <circle
                    className="Connector"
                    style={{
                        fill: CONN_IN_COLORS[i % CONN_IN_COLORS.length]
                    }}
                    key={i}
                    cx={calculateConnectorX(size, ConnectorType.input)}
                    cy={calculateConnectorY(i + 1)}
                    onMouseDown={e => props.onConnectorMouseDown(
                        node_id,
                        ConnectorType.input,
                        i + 1,
                        e,
                    )}
                    onMouseUp={e => props.onConnectorMouseUp(
                        node_id,
                        ConnectorType.input,
                        i + 1,
                        e,
                    )}
                />
            )}
            <text
                x="50%"
                dominantBaseline="middle"
                textAnchor="middle"
                className="ContentText"
            >
                {wrappedContentString(props.node_name).map((s, i) =>
                    <tspan key={i} x="50%" dy={NODE_LINE_HEIGHT}>{s}</tspan>
                )}
            </text>
            {Array(props.outputs).fill(1).map((_, i) =>
                <circle
                    key={i}
                    className="Connector"
                    style={{
                        fill: CONN_OUT_COLORS[i % CONN_OUT_COLORS.length]
                    }}
                    cx={calculateConnectorX(size, ConnectorType.output)}
                    cy={calculateConnectorY(i + 1)}
                    onMouseDown={e => props.onConnectorMouseDown(
                        node_id,
                        ConnectorType.output,
                        i + 1,
                        e,
                    )}
                    onMouseUp={e => props.onConnectorMouseUp(
                        node_id,
                        ConnectorType.output,
                        i + 1,
                        e,
                    )}
                />
            )}
        </svg>
    );
}
