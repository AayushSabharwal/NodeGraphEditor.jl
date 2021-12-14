import React from 'react';
import './Node.scss'

export type Vec2 = {
    x: number,
    y: number,
}

export type ConnectorType = "input" | "output"

export interface NodeProps extends React.SVGAttributes<SVGGElement> {
    node_id: number,
    pos: Vec2,
    size: Vec2,
}

export function calculateNodeSize(max_conn: number, content_size: Vec2 = { x: 50, y: 50 }): Vec2 {
    return {
        x: content_size.x + 40,
        y: Math.max(content_size.y, max_conn * 20 + 5),
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
            <g id={"node_" + node_id} {...(this.props as React.SVGAttributes<SVGGElement>)}>
                <rect width={size.x} height={size.y} x={pos.x} y={pos.y} className="Node" fill="red" />
                {this.props.children}
            </g>
        );
    }
}
