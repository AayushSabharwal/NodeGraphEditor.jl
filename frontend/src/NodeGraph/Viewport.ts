import { useCallback, useState } from "preact/hooks";
import { Vec2 } from "~/src/lib/types";
import { MAX_ZOOM, MIN_ZOOM, PAN_BUTTON, ZOOM_SPEED } from "~/src/lib/constants";

export function useViewport() {
    const [panning, setPanning] = useState(false);
    const [panstart, setPanstart] = useState<Vec2>({ x: 0, y: 0 });
    const [vp_panstart, setVp_panstart] = useState<Vec2>({ x: 0, y: 0 });
    const [viewport, setViewport] = useState<Vec2>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);

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
        
        setViewport({
            x: vp_panstart.x - (e.pageX - panstart.x) * zoom,
            y: vp_panstart.y - (e.pageY - panstart.y) * zoom,
        });

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
        const new_zoom = Math.max(
            MIN_ZOOM,
            Math.min(MAX_ZOOM, zoom + e.deltaY * ZOOM_SPEED)
        );

        setViewport({
            x: viewport.x + e.pageX * (zoom - new_zoom),
            y: viewport.y + e.pageY * (zoom - new_zoom),
        });

        setZoom(new_zoom);

        e.stopPropagation();
    }, [viewport, zoom]);

    return { viewport, zoom, onPanMouseDown, onPanMouseMove, onPanMouseUp, onZoomWheel };
}