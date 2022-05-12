<script lang="ts">
    import { dragstate } from "./stores/drag_store";
    import { nodegraph } from "./stores/graph_store";
    import Node from "./Node.svelte";
    import { viewport } from "./stores/viewport_store";
    import Edge from "./Edge.svelte";
    import { connector_positions } from "./stores/positions_store";
    import type { MyConnector } from "./types";
import { DRAG_KEY } from "./constants";

    let height = 0,
        width = 0;

    function connectorPositionExists(conn: MyConnector) {
        return (
            conn.node in $connector_positions &&
            conn.type in $connector_positions[conn.node] &&
            ![null, undefined].includes(
                $connector_positions[conn.node][conn.type][conn.index]
            )
        );
    }
</script>

<div
    class="w-full h-full bg-gray-200 p-0 m-0"
    bind:clientHeight={height}
    bind:clientWidth={width}
    on:mousedown={e =>
        e.button === DRAG_KEY && dragstate.startDrag({
            drag_type: "stage",
            drag_name: "",
            drag_offset: [e.offsetX, e.offsetY],
            drag_callback: e => viewport.dragViewport([e.movementX, e.movementY]),
        })}
>
    <svg
        class="w-full h-full p-0 m-0"
        xmlns="http://www.w3.org/2000/svg"
        {width}
        {height}
    >
        {#each $nodegraph.edges as edge}
            {#if connectorPositionExists(edge.src) && connectorPositionExists(edge.dst)}
                <Edge
                    src={$connector_positions[edge.src.node][edge.src.type][
                        edge.src.index
                    ]}
                    dst={$connector_positions[edge.dst.node][edge.dst.type][
                        edge.dst.index
                    ]}
                />
            {/if}
        {/each}
    </svg>
    {#each Object.values($nodegraph.nodes) as node (node.id)}
        <Node id={node.id} />
    {/each}
</div>
