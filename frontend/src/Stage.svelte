<script lang="ts">
    import Background from "./Background.svelte";
    import { DRAG_KEY } from "./constants";
    import Edge from "./Edge.svelte";
    import Node from "./Node.svelte";
    import { dragstate } from "./stores/drag_store";
    import { nodegraph } from "./stores/graph_store";
    import { connector_positions } from "./stores/positions_store";
    import { viewport } from "./stores/viewport_store";
    import type { MyConnector, PositionsState } from "./types";

    let height = 0,
        width = 0;

    function connectorPositionExists(pos: PositionsState, conn: MyConnector) {
        return (
            conn.node in pos &&
            conn.type in pos[conn.node] &&
            ![null, undefined].includes(pos[conn.node][conn.type][conn.index])
        );
    }
</script>

<div
    class="w-full h-full bg-gray-200 p-0 m-0"
    bind:clientHeight={height}
    bind:clientWidth={width}
    on:mousedown|preventDefault|stopPropagation={e =>
        e.button === DRAG_KEY &&
        dragstate.startDrag({
            drag_type: "stage",
            drag_name: "",
            drag_offset: [e.offsetX, e.offsetY],
            drag_callback: e => viewport.dragViewport([e.movementX, e.movementY]),
        })}
>
    <svg
        viewBox={`${$viewport.position[0]} ${$viewport.position[1]} ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
    >
        <Background />
        {#each $nodegraph.edges as edge}
            {#if connectorPositionExists($connector_positions, edge.src) && connectorPositionExists($connector_positions, edge.dst)}
                <Edge
                    src={$connector_positions[edge.src.node][edge.src.type][
                        edge.src.index
                    ]}
                    dst={$connector_positions[edge.dst.node][edge.dst.type][
                        edge.dst.index
                    ]}
                    src_side={edge.src.type}
                    dst_side={edge.dst.type}
                />
            {/if}
        {/each}
        {#if $dragstate.drag_type === "connector"}
            <Edge
                src={$connector_positions[$dragstate.drag_name.node][
                    $dragstate.drag_name.type
                ][$dragstate.drag_name.index]}
                dst={$dragstate.drag_offset}
                src_side={$dragstate.drag_name.type}
                dst_side="input"
            />
        {/if}
    </svg>
    {#each Object.values($nodegraph.nodes) as node (node.id)}
        <Node id={node.id} />
    {/each}
</div>
