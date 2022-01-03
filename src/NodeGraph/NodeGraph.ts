import { Edge, NodeData, NodeType } from "~/src/lib/types";
import { DefaultCapacitance, DefaultInductance, DefaultNodeData, DefaultResistance, DefaultVoltageSource } from "~/src/lib/constants";
import { calculateNodeSize } from "~/src/NodeGraph/Node";

export class NodeGraph {
    nodes: NodeData[];
    edges: Edge[];
    newnode_id: number;

    constructor(nodes: NodeData[] = [], edges: Edge[] = [], newnode_id: number = -1) {
        this.nodes = nodes;
        this.edges = edges;
        if(newnode_id === -1) {
            this.nodes.forEach(n => newnode_id = Math.max(n.node_id, newnode_id));
            newnode_id += 1;
        }
        this.newnode_id = newnode_id;
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

    withUpdatedNode(ind: number, node: NodeData): NodeGraph {
        let nodes = this.nodes;
        nodes.splice(ind, 1, node);
        return new NodeGraph(nodes, this.edges);
    }

    withUpdatedNodeParams<T extends NodeType>(id: number, params: T): NodeGraph {
        const ind = this.nodes.findIndex(n => n.node_id === id);
        if (ind === -1)
            return this;
        const node = {
            ...this.nodes[ind],
            params,
        }
        return this.withUpdatedNode(ind, node);
    }

    withNewEdge(edge: Edge): NodeGraph {
        if (this.edges.find(ed =>
            ed.from_conn === edge.from_conn &&
            ed.from_type === edge.from_type &&
            ed.to === edge.to &&
            ed.to_conn === edge.to_conn &&
            ed.to_type === edge.to_type
        ))
            return this;
        return new NodeGraph(this.nodes, [...this.edges, edge]);
    }

    withNewNode(type: string): NodeGraph {
        let newnode: NodeData = {
            ...DefaultNodeData,
            node_name: type,
            node_id: this.newnode_id,
            params: { ...DefaultVoltageSource },
        };
        switch (type) {
            case "VoltageSource":
                newnode.params = { ...DefaultVoltageSource }
                break;
            case "Resistance":
                newnode.params = { ...DefaultResistance };
                break;
            case "Capacitance":
                newnode.params = { ...DefaultCapacitance };
                break;
            case "Inductance":
                newnode.params = { ...DefaultInductance };
                break;
            default:
                console.error("Unhandled Add Node type");
                return this;
        }
        newnode.size = calculateNodeSize(newnode);
        return new NodeGraph([...this.nodes, newnode], this.edges, this.newnode_id + 1);
    }

    withDeletedNode(id: number): NodeGraph {
        const nodes = this.nodes.filter(n => n.node_id !== id);
        const edges = this.edges.filter(e => e.from !== id && e.to !== id);
        return new NodeGraph(nodes, edges);
    }
}
