import React from 'react';
import './Node.scss'
import { CONN_IN_COLORS, CONN_OUT_COLORS, CONN_RADIUS, CONN_SIDE_MARGIN, CONN_Y_SPACING, IMAGE_ASPECT_RATIOS, IMAGE_SIZE, NODE_CHAR_WIDTH, NODE_LINE_HEIGHT, NODE_MAX_WIDTH, NODE_MIN_WIDTH } from 'lib/constants';
import { Vec2, ConnectorType, NodeProps, NodeData } from 'lib/types';

export function calculateConnectorX(parent_size: Vec2, type: ConnectorType) {
    if (type === "input")
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
    const conn = Math.max(node.params.inputs, node.params.outputs);
    return {
        x: Math.min(
            Math.max(
                IMAGE_SIZE.x,
                node.node_name.length * NODE_CHAR_WIDTH,
                NODE_MIN_WIDTH
            ),
            NODE_MAX_WIDTH
        ) + 2 * (2 * CONN_RADIUS + CONN_Y_SPACING),
        y: Math.max(
            conn * (2 * CONN_RADIUS + CONN_Y_SPACING) - CONN_Y_SPACING,
            IMAGE_SIZE.y / IMAGE_ASPECT_RATIOS[node.params.type]
            + NODE_LINE_HEIGHT * wrappedContentStringLines(node.node_name),
        ) + 2 * CONN_Y_SPACING,
    }
}

export class Node extends React.Component<NodeProps, {}> {
    public static defaultProps = {
        pos: { x: 0, y: 0 },
        size: { x: 150, y: 75 },
    }

    render() {
        const { node_id, pos, size } = this.props;
        return (
            <svg
                id={"node_" + node_id}
                width={size.x}
                height={size.y}
                x={pos.x}
                y={pos.y}
                {...(this.props as React.SVGAttributes<SVGGElement>)}
                xmlns="http://www.w3.org/2000/svg"
            >
                <rect className="NodeBorder"/>
                <rect className="Node"/>
                {this.props.children}
                {Array(this.props.params.inputs).fill(1).map((_, i) =>
                    <circle
                        className="Connector"
                        style={{
                            fill: CONN_IN_COLORS[i%CONN_IN_COLORS.length]
                        }}
                        key={i}
                        cx={calculateConnectorX(size, "input")}
                        cy={calculateConnectorY(i + 1)}
                        onMouseDown={e => this.props.onConnectorMouseDown(
                            node_id,
                            "input",
                            i + 1,
                            e,
                        )}
                        onMouseUp={e => this.props.onConnectorMouseUp(
                            node_id,
                            "input",
                            i + 1,
                            e,
                        )}
                    />
                )}
                <image
                    filter="invert(1)"
                    href={`/assets/${this.props.params.type}.svg`}
                    x={(size.x - IMAGE_SIZE.x) / 2}
                    width={IMAGE_SIZE.x}
                />
                <text
                    x="50%"
                    y={IMAGE_SIZE.y / IMAGE_ASPECT_RATIOS[this.props.params.type]}
                    dominantBaseline="middle"
                    textAnchor="middle"
                    className="ContentText"
                >
                    {wrappedContentString(this.props.node_name).map((s, i) =>
                        <tspan key={i} x="50%" dy={NODE_LINE_HEIGHT}>{s}</tspan>
                    )}
                </text>
                {Array(this.props.params.outputs).fill(1).map((_, i) =>
                    <circle
                        key={i}
                        className="Connector"
                        style={{
                            fill: CONN_OUT_COLORS[i%CONN_OUT_COLORS.length]
                        }}
                        cx={calculateConnectorX(size, "output")}
                        cy={calculateConnectorY(i + 1)}
                        onMouseDown={e => this.props.onConnectorMouseDown(
                            node_id,
                            "output",
                            i + 1,
                            e,
                        )}
                        onMouseUp={e => this.props.onConnectorMouseUp(
                            node_id,
                            "output",
                            i + 1,
                            e,
                        )}
                    />
                )}
            </svg>
        );
    }
}
