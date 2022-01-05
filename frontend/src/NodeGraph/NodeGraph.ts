import { Edge, Err, NodeData } from "~/src/lib/types";
import axios, { AxiosResponse } from "axios";

export class NodeGraph {
    nodes: NodeData[];
    edges: Edge[];

    constructor(nodes: NodeData[] = [], edges: Edge[] = []) {
        this.nodes = nodes;
        this.edges = edges;
    }
    
    static fromJSON(str: string): NodeGraph | string {
        const json = JSON.parse(str);
        if (!("nodes" in json))
            return "KeyError: Missing `nodes` key in JSON";
        if (!Array.isArray(json.nodes))
            return "ValueError: `nodes` key is not Array";
        if (!("edges" in json))
            return "KeyError: Missing `edges` key in JSON";
        if (!Array.isArray(json.edges))
            return "ValueError: `edges` key is not Array";

        return new NodeGraph(json.nodes, json.edges);
    }

    toJSON(): string {
        return JSON.stringify({nodes: this.nodes, edges: this.edges});
    }

    withUpdatedNode(id: number, key: string, value: any): Promise<AxiosResponse<NodeGraph | Err>> {
        return axios.post<NodeGraph | Err>(`/updatenode/${id}/${key}/${value}`);
    }

    withUpdatedNodeParams(id: number, key: string, value: any): Promise<AxiosResponse<NodeGraph | Err>> {
        return axios.post<NodeGraph | Err>(`/updateparams/${id}/${key}/${value}`);
    }

    withNewEdge(edge: Edge): Promise<AxiosResponse<NodeGraph | Err>> {
        return axios.post<NodeGraph | Err>('/addedge', edge);
    }

    withNewNode(type: string): Promise<AxiosResponse<NodeGraph | Err>> {
        return axios.post<NodeGraph | Err>(`/addnode/${type}`);
    }

    withDeletedNode(id: number): Promise<AxiosResponse<NodeGraph | Err>> {
        return axios.post<NodeGraph | Err>(`/deletenode/${id}`);
    }

    withTempChangedNode(ind: number, node: NodeData): NodeGraph {
        let nodes = this.nodes;
        nodes.splice(ind, 1, node);
        return new NodeGraph(nodes, this.edges);
    }
}
