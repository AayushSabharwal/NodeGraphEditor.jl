import { Edge, Vec2 } from "~/src/lib/types";
import "./Stage.scss"
import { BackgroundLayer } from "~/src/NodeGraph/BackgroundLayer";
import { NodeLayer } from "~/src/NodeGraph/NodeLayer";
import { EdgeLayer } from "~/src/NodeGraph/EdgeLayer";
import { NodeGraph } from "~/src/NodeGraph/NodeGraph";
import { useViewport } from "~/src/NodeGraph/Viewport";
import { useEffect } from "preact/hooks";

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
    const { viewport, zoom, onPanMouseDown, onPanMouseMove, onPanMouseUp, onZoomWheel } = useViewport();

    useEffect(() => document.addEventListener('contextmenu', e => e.preventDefault()), []);

    return (
        <svg
                className="Stage"
                width={props.width}
                height={props.height}
                viewBox={`${viewport.x} ${viewport.y} ${props.width * zoom} ${props.height * zoom}`}
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
                    zoom={zoom}
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
    );
}
