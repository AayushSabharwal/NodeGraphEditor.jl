import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Editor } from "~/src/Editor/Editor";
import { Stage } from "~/src/NodeGraph/Stage";
import { fetchGraph } from "./lib/graphSlice";
import { resizeViewport } from "./lib/viewportSlice";

export default function Manager() {
    const dispatch = useDispatch();
    
    useEffect(() => { dispatch(fetchGraph()); }, []);
    
    let height = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight,
    );
    let width = Math.max(
        document.body.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.clientWidth,
        document.documentElement.scrollWidth,
        document.documentElement.offsetWidth,
    );
    useEffect(
        () => { dispatch(resizeViewport({ x: width, y: height })); },
        [width, height]
    );

    return (
        <>
            <Stage/>
            <Editor/>
        </>
    );
}