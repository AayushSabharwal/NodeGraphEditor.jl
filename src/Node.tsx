import React from 'react';
import './Node.scss'

export type Vec2 = {
    x: number,
    y: number,
}

export type ConnectorType = "input" | "output"

export interface NodeData {
    node_id: number,
    pos: Vec2,
    size: Vec2,
    inputs: number,
    outputs: number,
}

export interface NodeProps extends NodeData, React.SVGAttributes<SVGGElement> {
    onConnectorMouseUp: (id: number, type: ConnectorType, conn: number, e: React.MouseEvent) => void,
    onConnectorMouseDown: (id: number, type: ConnectorType, conn: number, e: React.MouseEvent) => void,
}

export function calculateConnectorX(parent_pos: Vec2, parent_size: Vec2, type: ConnectorType) {
    if (type === "input")
        return parent_pos.x + 12.5;
    else
        return parent_pos.x + parent_size.x - 12.5;
}

export function calculateConnectorY(parent_pos: Vec2, index: number) {
    return parent_pos.y + (index - 1) * 20 + 12.5;
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
                {Array(this.props.inputs).fill(1).map((_, i) =>
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
                {Array(this.props.outputs).fill(1).map((_, i) =>
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
