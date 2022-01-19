import "./Stage.scss"
import { BackgroundLayer } from "~/src/NodeGraph/BackgroundLayer";
import { NodeLayer } from "~/src/NodeGraph/NodeLayer";
import { EdgeLayer } from "~/src/NodeGraph/EdgeLayer";
import { useCallback, useEffect, useState } from "preact/hooks";
import { Button, SimpleGrid, Text } from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { Vec2 } from "../lib/types";
import { useDispatch, useSelector } from "react-redux";
import { MIN_ZOOM, PAN_BUTTON, ZOOM_SPEED } from "../lib/constants";
import { moveViewport, vpPosSelector, vpSizeSelector, vpZoomSelector, zoomIn, zoomOut, zoomTo } from "../lib/viewportSlice";

export function Stage() {
    useEffect(() => document.addEventListener('contextmenu', e => e.preventDefault()), []);

    const [panning, setPanning] = useState(false);
    const [panstart, setPanstart] = useState<Vec2>({ x: 0, y: 0 });
    const [vp_panstart, setVp_panstart] = useState<Vec2>({ x: 0, y: 0 });
    const viewport = useSelector(vpPosSelector());
    const dimensions = useSelector(vpSizeSelector());
    const zoom = useSelector(vpZoomSelector());

    const dispatch = useDispatch();
    
    const onPanMouseDown = (e: MouseEvent) => {
        if (e.button !== PAN_BUTTON)
            return;
        
        setPanning(true);
        setPanstart({
            x: e.pageX,
            y: e.pageY,
        });
        setVp_panstart({
            x: viewport.x,
            y: viewport.y,
        });
        
        e.stopPropagation();
        e.preventDefault();
    }
    
    const onPanMouseMove = useCallback((e: MouseEvent) => {
        if (!panning)
            return;
        
        dispatch(moveViewport({
            x: vp_panstart.x - (e.pageX - panstart.x) / zoom,
            y: vp_panstart.y - (e.pageY - panstart.y) / zoom,
        }));

        e.stopPropagation();
        e.preventDefault();
    }, [panning, vp_panstart, panstart]);

    const onPanMouseUp = (e: MouseEvent) => {
        if (e.button !== PAN_BUTTON)
            return;

        setPanning(false);

        e.stopPropagation();
        e.preventDefault();
    };

    const onZoomWheel = useCallback((e: WheelEvent) => {
        dispatch(zoomTo({
            zoom: zoom - Math.sign(e.deltaY) * ZOOM_SPEED,
            focus: { x: e.pageX, y: e.pageY }
        }));

        e.stopPropagation();
    }, [zoom]);

    return (
        <>
            <svg
                className="Stage"
                width={dimensions.x}
                height={dimensions.y}
                viewBox={`${viewport.x} ${viewport.y} ${dimensions.x / zoom} ${dimensions.y / zoom}`}
                onWheel={onZoomWheel}
                onMouseDown={onPanMouseDown}
                onMouseMove={onPanMouseMove}
                onMouseUp={onPanMouseUp}
                xmlns="http://www.w3.org/2000/svg"
            >
                <BackgroundLayer/>
                <NodeLayer/>
                <EdgeLayer/>
            </svg>
            <SimpleGrid
                templateRows="1fr 1fr 1fr"
                className='control'
                background='rgb(255,255,255,0.08)'
            >
                <Button
                    background='transparent'
                    onClick={() => dispatch(zoomIn())}
                >
                    <AddIcon/>
                </Button>
                <Text width='100%' height='100%' textAlign='center' alignItem='center'>
                    {Math.round(zoom * 100) + '%'}
                </Text>
                <Button
                    background='transparent'
                    onClick={() => dispatch(zoomOut())}
                >
                    <MinusIcon/>
                </Button>
            </SimpleGrid>
        </>
    );
}
