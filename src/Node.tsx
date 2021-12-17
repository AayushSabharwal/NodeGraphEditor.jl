import React from 'react';
import './Node.scss'
import { CONN_RADIUS, CONN_SIDE_MARGIN, CONN_Y_SPACING } from './constants';
import { Vec2, ConnectorType, NodeProps } from './types';

export function calculateConnectorX(parent_pos: Vec2, parent_size: Vec2, type: ConnectorType) {
    if (type === "input")
        return parent_pos.x + CONN_RADIUS + CONN_SIDE_MARGIN;
    else
        return parent_pos.x + parent_size.x - (CONN_RADIUS + CONN_SIDE_MARGIN);
}

export function calculateConnectorY(parent_pos: Vec2, index: number) {
    return parent_pos.y + (index - 1) * (2 * CONN_RADIUS + CONN_Y_SPACING) + CONN_RADIUS + CONN_Y_SPACING;
}

export function calculateNodeSize(max_conn: number, content_size: Vec2 = { x: 50, y: 50 }): Vec2 {
    return {
        x: content_size.x + 4 * (CONN_SIDE_MARGIN + CONN_RADIUS),
        y: Math.max(content_size.y, max_conn * (2 * CONN_RADIUS + CONN_Y_SPACING) + CONN_Y_SPACING),
    }
}

export function calculateContentX(parent_pos: Vec2) {
    return parent_pos.x + 2 * (CONN_SIDE_MARGIN + CONN_RADIUS);
}

export function calculateContentY(parent_pos: Vec2, parent_size: Vec2) {
    return parent_pos.y + parent_size.y / 2;
}


export class Node extends React.Component<NodeProps, {}> {
    public static defaultProps = {
        pos: { x: 0, y: 0 },
        size: { x: 150, y: 75 },
    }

    render() {
        const { node_id, pos, size } = this.props;
        return (
            <g id={"node_" + node_id} {...(this.props as React.SVGAttributes<SVGGElement>)}>
                <rect width={size.x} height={size.y} x={pos.x} y={pos.y} className="Node" fill="red" strokeWidth={this.props.selected ? 1 : 0} stroke="rgb(0,0,255)" />
                {this.props.children}
                {Array(this.props.params.inputs).fill(1).map((_, i) =>
                    <circle
                        className="Connector"
                        key={i}
                        cx={calculateConnectorX(pos, size, "input")}
                        cy={calculateConnectorY(pos, i + 1)}
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
                <text
                    x={calculateContentX(pos)}
                    y={calculateContentY(pos, size)}
                    className="ContentText"
                >
                    {this.props.params.type}
                </text>
                {Array(this.props.params.outputs).fill(1).map((_, i) =>
                    <circle
                        key={i}
                        className="Connector"
                        cx={calculateConnectorX(pos, size, "output")}
                        cy={calculateConnectorY(pos, i + 1)}
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
            </g>
        );
    }
}
