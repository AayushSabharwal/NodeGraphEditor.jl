import React from 'react';
import { Vec2 } from './Node';

export interface ConnectionProps {
    from: Vec2,
    to: Vec2,
}

export class Connection extends React.Component<ConnectionProps> {
    render() {
        return (
            <line
                x1={this.props.from.x}
                y1={this.props.from.y}
                x2={this.props.to.x}
                y2={this.props.to.y}
                stroke="rgb(0,255,0)"
                strokeWidth={2}
            />
        );
    }
}