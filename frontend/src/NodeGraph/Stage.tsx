import { Edge, Vec2 } from "~/src/lib/types";
import "./Stage.scss"
import { BackgroundLayer } from "~/src/NodeGraph/BackgroundLayer";
import { NodeLayer } from "~/src/NodeGraph/NodeLayer";
import { EdgeLayer } from "~/src/NodeGraph/EdgeLayer";
import { NodeGraph } from "~/src/NodeGraph/NodeGraph";
import { useViewport } from "~/src/NodeGraph/Viewport";
import { useEffect } from "preact/hooks";
import { Button, SimpleGrid, Text } from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";

export interface StageProps {
    width: number,
    height: number,
    graph: NodeGraph,
    dragNode: (ind: number, pos: Vec2) => void,
    onNodeDragEnd: (ind: number) => void,
    addEdge: (edge: Edge) => void,
    deleteEdge: (edge: Edge) => void,
    selectNode: (id: number) => void,
    selection: number,
}

export function Stage(props: StageProps) {
    const {
        viewport,
        zoom,
        onPanMouseDown,
        onPanMouseMove,
        onPanMouseUp,
        onZoomWheel,
        zoomIn,
        zoomOut
    } = useViewport();

    useEffect(() => document.addEventListener('contextmenu', e => e.preventDefault()), []);

    return (
        <>
            <svg
                className="Stage"
                width={props.width}
                height={props.height}
                viewBox={`${viewport.x} ${viewport.y} ${props.width / zoom} ${props.height / zoom}`}
                onWheel={onZoomWheel}
                onMouseDown={onPanMouseDown}
                onMouseMove={onPanMouseMove}
                onMouseUp={onPanMouseUp}
                xmlns="http://www.w3.org/2000/svg"
            >
                <BackgroundLayer/>
                <NodeLayer
                    graph={props.graph}
                    selected={props.selection}
                    viewportPos={viewport}
                    viewportSize={{x: props.width, y: props.height}}
                    zoom={1 / zoom}
                    selectNode={props.selectNode}
                    dragNode={props.dragNode}
                    onNodeDragEnd={props.onNodeDragEnd}
                    addEdge={props.addEdge}
                />
                <EdgeLayer
                    graph={props.graph}
                    deleteEdge={props.deleteEdge}
                />
            </svg>
            <SimpleGrid
                templateRows="1fr 1fr 1fr"
                className='control'
                background='rgb(255,255,255,0.08)'
            >
                <Button
                    background='transparent'
                    onClick={() => zoomIn({ x: props.width * 0.35, y: props.height * 0.35 })}
                >
                    <AddIcon/>
                </Button>
                <Text width='100%' height='100%' textAlign='center' alignItem='center'>
                    {Math.round(zoom * 100) + '%'}
                </Text>
                <Button
                    background='transparent'
                    onClick={() => zoomOut({ x: props.width * 0.35, y: props.height * 0.35 })}
                >
                    <MinusIcon/>
                </Button>
            </SimpleGrid>
        </>
    );
}
