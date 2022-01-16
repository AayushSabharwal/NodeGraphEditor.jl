import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "preact/hooks";
import { Editor } from "~/src/Editor/Editor";
import { Edge, Vec2 } from "~/src/lib/types";
import { NodeGraph } from "~/src/NodeGraph/NodeGraph";
import { Stage } from "~/src/NodeGraph/Stage";

export default function Manager() {
    const [graph, setGraph] = useState(new NodeGraph());
    const [selected, setSelected] = useState(-1);

    const handleGraphPromise = (p: Promise<AxiosResponse<NodeGraph>>) => {
        p.then(res => {
            setGraph(new NodeGraph(res.data.nodes, res.data.edges));
        }).catch(e => console.log(e));
    }

    const updateNode = (id: number, key: string, value: any) =>
        handleGraphPromise(axios.post<NodeGraph>(`/updatenode/${id}`, { key, value }));
    const updateNodeParams = (id: number, key: string, value: any) =>
        handleGraphPromise(axios.post<NodeGraph>(`/updateparams/${id}`, { key, value }));
    const addEdge = (edge: Edge) =>
        handleGraphPromise(axios.post<NodeGraph>('/addedge', edge));
    const addNode = (type: string) =>
        handleGraphPromise(axios.post<NodeGraph>(`/addnode/${type}`));
    const deleteEdge = (edge: Edge) =>
        handleGraphPromise(axios.post<NodeGraph>('/deleteedge', edge));
    const deleteNode = (id: number) =>
        handleGraphPromise(axios.post<NodeGraph>(`/deletenode/${id}`));
    const onNodeDrag = (ind: number, pos: Vec2) => {
        let nodes = graph.nodes;
        let node = nodes[ind];
        node.pos = pos;
        nodes.splice(ind, 1, node);
        setGraph(new NodeGraph(nodes, graph.edges));
    }
    const onNodeDragEnd = (ind: number) =>
        updateNode(
            graph.nodes[ind].node_id,
            "pos",
            graph.nodes[ind].pos
        );
    
    // fetch graph
    useEffect(() => handleGraphPromise(axios.get<NodeGraph>("/graph")), []);

    const height = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight,
    );
    const width = Math.max(
        document.body.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.clientWidth,
        document.documentElement.scrollWidth,
        document.documentElement.offsetWidth,
    );

    return <>
        <Stage
            width={width}
            height={height}
            graph={graph}
            selection={selected}
            dragNode={onNodeDrag}
            onNodeDragEnd={onNodeDragEnd}
            addEdge={addEdge}
            selectNode={setSelected}
            deleteEdge={deleteEdge}
        />
        <Editor
            graph={graph}
            selected={selected}
            addNode={addNode}
            updateNode={updateNode}
            updateNodeParams={updateNodeParams}
            deleteNode={deleteNode}
        />
    </>
}