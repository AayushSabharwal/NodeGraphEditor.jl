import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { calculateNodeSize } from "../NodeGraph/Node";
import { RootState } from "./store";
import { Edge, Graph, Vec2 } from "./types";

const initialState: Graph = {
    nodes: [],
    edges: []
}

const preprocessGraph = (g: Graph): Graph => ({
    nodes: g.nodes.map(n => ({...n, size: calculateNodeSize(n)})),
    edges: g.edges
});

export const fetchGraph = createAsyncThunk(
    'graph/fetch',
    async () => {
        const r = await axios.get<Graph>('/graph');
        return r.data;
    }
);

export const updateNode = createAsyncThunk(
    'graph/updatenode',
    async (action: { id: number, key: string, value: any}) => {
        const r = await axios.post<Graph>(
            `/updatenode/${action.id}/${action.key}`,
            { value: action.value }
        );
        return r.data;
    }
);

export const addEdge = createAsyncThunk(
    'graph/addedge',
    async (edge: Edge) => {
        const r = await axios.post<Graph>('/addedge', edge);
        return r.data;
    }
);

export const addNode = createAsyncThunk(
    'graph/addnode',
    async (type: string) => {
        const r = await axios.post<Graph>(`/addnode/${type}`);
        return r.data;
    }
)

export const deleteEdge = createAsyncThunk(
    'graph/deleteedge',
    async (edge: Edge) => {
        const r = await axios.post<Graph>('/deleteedge', edge);
        return r.data;
    }
)

export const deleteNode = createAsyncThunk(
    'graph/deletenode',
    async (id: number) => {
        const r = await axios.post<Graph>(`/deletenode/${id}`);
        return r.data;
    }
)

export const graphSlice = createSlice({
    name: 'graph',
    initialState,
    reducers: {
        dragNode(graph, action: PayloadAction<{id: number, pos: Vec2}>) {
            const {id, pos} = action.payload;
            graph.nodes = graph.nodes.map(n => n.node_id === id ? {...n, pos} : n);
        }
    },
    extraReducers(builder) {
        builder
            .addCase(
                fetchGraph.fulfilled,
                (_, action) => preprocessGraph(action.payload)
            )
            .addCase(
                updateNode.fulfilled,
                (_, action) => preprocessGraph(action.payload)
            )
            .addCase(
                addEdge.fulfilled,
                (_, action) => preprocessGraph(action.payload)
            )
            .addCase(
                addNode.fulfilled,
                (_, action) => preprocessGraph(action.payload)
            )
            .addCase(
                deleteEdge.fulfilled,
                (_, action) => preprocessGraph(action.payload)
            )
            .addCase(
                deleteNode.fulfilled,
                (_, action) => preprocessGraph(action.payload)
            )
    }
})

export const { dragNode } = graphSlice.actions;

export const graphSelector = () => (state: RootState) => state.graph;

export const nodeSelector = 
    (id: number) =>
        (state: RootState) =>
            state.graph.nodes.find(n => n.node_id === id);

export const indexSelector =
    (id: number) =>
        (state: RootState) =>
            state.graph.nodes.findIndex(n => n.node_id === id);
