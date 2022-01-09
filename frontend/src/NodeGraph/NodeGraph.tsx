import { Edge, NodeData } from "~/src/lib/types";
import axios, { AxiosResponse } from "axios";
import { calculateNodeSize } from "~/src/NodeGraph/Node";

export class NodeGraph {
    nodes: NodeData[];
    edges: Edge[];

    constructor(nodes: NodeData[] = [], edges: Edge[] = []) {
        this.nodes = nodes.map(n => ({...n, size: calculateNodeSize(n)}));
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
        return JSON.stringify({ nodes: this.nodes, edges: this.edges });
    }

    findNode(id: number): NodeData | undefined {
        return this.nodes.find(node => node.node_id === id);
    }

    findNodeIndex(id: number): number {
        return this.nodes.findIndex(node => node.node_id === id);
    }

    withUpdatedNode(id: number, key: string, value: any): Promise<AxiosResponse<NodeGraph>> {
        return axios.post<NodeGraph>(`/updatenode/${id}`, { key, value });
    }

    withUpdatedNodeParams(id: number, key: string, value: any): Promise<AxiosResponse<NodeGraph>> {
        return axios.post<NodeGraph>(`/updateparams/${id}`, { key, value });
    }

    withNewEdge(edge: Edge): Promise<AxiosResponse<NodeGraph>> {
        return axios.post<NodeGraph>('/addedge', edge);
    }

    withNewNode(type: string): Promise<AxiosResponse<NodeGraph>> {
        return axios.post<NodeGraph>(`/addnode/${type}`);
    }

    withDeletedNode(id: number): Promise<AxiosResponse<NodeGraph>> {
        return axios.post<NodeGraph>(`/deletenode/${id}`);
    }

    withTempChangedNode(ind: number, node: NodeData): NodeGraph {
        let nodes = this.nodes;
        nodes.splice(ind, 1, node);
        return new NodeGraph(nodes, this.edges);
    }
}
