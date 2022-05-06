<script lang="ts">
    import { dragstate } from "./stores/drag_store";
    import { nodegraph } from "./stores/graph_store";
    import Node from "./Node.svelte";
    import { viewport } from "./stores/viewport_store";

    let height = 0,
        width = 0;
</script>

<div
    class="w-full h-full bg-gray-200 p-0 m-0"
    bind:clientHeight={height}
    bind:clientWidth={width}
    on:mousedown={e =>
        dragstate.startDrag({
            drag_type: "stage",
            drag_name: "",
            drag_offset: [e.offsetX, e.offsetY],
            drag_callback: e => viewport.dragViewport([e.movementX, e.movementY]),
        })}
>
    {#each Object.keys($nodegraph.nodes) as name (name)}
        <Node {name} />
    {/each}
</div>
