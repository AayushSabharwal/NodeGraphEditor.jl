import React from 'react';
import './Node.scss'

export type Vec2 = {
    x: number,
    y: number,
}
export interface NodeProps extends React.HTMLAttributes<HTMLDivElement> {
    name: string
    node_id: number
    pos: Vec2
    inputs: number
    outputs: number
}


export class Node extends React.Component<NodeProps, {}> {
    public static defaultProps = {
        name: "UNNAMED",
        pos: { x: 0, y: 0 },
        inputs: 0,
        outputs: 0,
    }
    ref: HTMLDivElement | undefined
    inputs: Vec2[]
    outputs: Vec2[]

    constructor(props: NodeProps) {
        super(props);
        this.inputs = Array(props.inputs).map(_ => ({ x: 0, y: 0 }))
        this.outputs = Array(props.outputs).map(_ => ({ x: 0, y: 0 }))
    }

    render() {
        const { name, pos, ...others } = this.props;
        return (
            <div
                ref={r => { if (r) this.ref = r }}
                style={{
                    left: pos.x + 'px',
                    top: pos.y + 'px',
                    height: 20 + 20 * Math.max(this.props.inputs, this.props.outputs),
                }}
                className='Node'
                {...others}
            >
                <div className='ConnectorContainer'>
                    {Array(this.props.inputs).fill(0).map((_, i) =>
                        <Connector
                            ref={r => r && r.ref && (
                                this.inputs[i] = { x: r.ref.offsetLeft, y: r.ref.offsetTop }
                            )}
                            key={i}
                            id={i}
                            type="in"
                            parent_id={this.props.node_id}
                        />
                    )}
                </div>
                {this.props.name}
                <div className='ConnectorContainer'>
                    {Array(this.props.outputs).fill(0).map((_, i) =>
                        <Connector
                            ref={r => r && r.ref && (
                                this.outputs[i] = { x: r.ref.offsetLeft, y: r.ref.offsetTop }
                            )}
                            key={i}
                            id={i}
                            type="out"
                            parent_id={this.props.node_id}
                        />
                    )}
                </div>
            </div>
        );
    }
}

interface ConnectorProps {
    id: number,
    type: "in" | "out",
    parent_id: number,
}

class Connector extends React.Component<ConnectorProps> {
    ref: HTMLDivElement | undefined

    render(): React.ReactNode {
        return (
            <div ref={r => { if (r) this.ref = r }} className={'Connector' + this.props.type}>
                {this.props.id}
            </div>
        );
    }
}