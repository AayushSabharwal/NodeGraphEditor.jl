import { Edge, Vec2 } from "~/src/lib/types";
import { Connection } from "~/src/NodeGraph/Connection";
import { calculateConnectorX, calculateConnectorY } from "~/src/NodeGraph/Connector";
import { NodeGraph } from "~/src/NodeGraph/NodeGraph";

function getEdgeKey(edge: Edge) {
    return `${edge.from}${edge.from_type}${edge.from_conn}_${edge.to}${edge.to_type}${edge.to_conn}`;
}

export interface ConnectionLayerProps {
    graph: NodeGraph
    deleteEdge: (edge: Edge) => void
}

export function ConnectionLayer(props: ConnectionLayerProps) {
    

    return (
        <>
            {props.graph.edges.map(edge => {
                const node_from = props.graph.findNode(edge.from);
                if (!node_from) return <g key={getEdgeKey(edge)}></g>
                const node_to = props.graph.findNode(edge.to);
                if (!node_to) return <g key={getEdgeKey(edge)}></g>
                return <Connection
                    key={getEdgeKey(edge)}
                    from={{
                        x: node_from.pos.x + calculateConnectorX(node_from.size, edge.from_type),
                        y: node_from.pos.y + calculateConnectorY(edge.from_conn),
                    }}
                    from_type={edge.from_type}
                    from_ind={edge.from_conn}
                    to={{
                        x: node_to.pos.x + calculateConnectorX(node_to.size, edge.to_type),
                        y: node_to.pos.y + calculateConnectorY(edge.to_conn),
                    }}
                    to_type={edge.to_type}
                    to_ind={edge.to_conn}
                    onClick={() => props.deleteEdge(edge)}
                />;
            })}
        </>
    );
}