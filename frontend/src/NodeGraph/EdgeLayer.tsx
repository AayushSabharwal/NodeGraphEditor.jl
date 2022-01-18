import { Edge, Vec2 } from "~/src/lib/types";
import { Connection } from "~/src/NodeGraph/Connection";
import { calculateConnectorX, calculateConnectorY } from "~/src/NodeGraph/Connector";
import { NodeGraph } from "~/src/NodeGraph/NodeGraph";
import { LINE_MAX_BEZIER_OFFSET } from "~/src/lib/constants";

function getEdgeKey(edge: Edge) {
    return `${edge.from}${edge.from_type}${edge.from_conn}_${edge.to}${edge.to_type}${edge.to_conn}`;
}

export interface EdgeLayerProps {
    graph: NodeGraph
    viewportPos: Vec2
    viewportSize: Vec2
    zoom: number
    deleteEdge: (edge: Edge) => void
}

export function EdgeLayer(props: EdgeLayerProps) {
    const edgeInViewport = (p1: Vec2, p2: Vec2) => {
        return Math.max(p1.x, p2.x) + LINE_MAX_BEZIER_OFFSET >= props.viewportPos.x &&
            Math.min(p1.x, p2.x) - LINE_MAX_BEZIER_OFFSET<= props.viewportPos.x + props.viewportSize.x * props.zoom &&
            Math.max(p1.y, p2.y) >= props.viewportPos.y &&
            Math.min(p1.y, p2.y) <= props.viewportPos.y + props.viewportSize.y * props.zoom;
    }
    return (
        <>
            {props.graph.edges.map(edge => {
                const node_from = props.graph.findNode(edge.from);
                if (!node_from) return null;
                const node_to = props.graph.findNode(edge.to);
                if (!node_to) return null;
                const from_pos = {
                    x: node_from.pos.x + calculateConnectorX(node_from.size, edge.from_type),
                    y: node_from.pos.y + calculateConnectorY(edge.from_conn),
                };
                const to_pos = {
                    x: node_to.pos.x + calculateConnectorX(node_to.size, edge.to_type),
                    y: node_to.pos.y + calculateConnectorY(edge.to_conn),
                }
                if(!edgeInViewport(from_pos, to_pos)) return null;

                return <Connection
                    key={getEdgeKey(edge)}
                    from={from_pos}
                    from_type={edge.from_type}
                    from_ind={edge.from_conn}
                    to={to_pos}
                    to_type={edge.to_type}
                    to_ind={edge.to_conn}
                    onClick={() => props.deleteEdge(edge)}
                />;
            })}
        </>
    );
}