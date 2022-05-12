<script lang="ts">
    import { DRAG_KEY } from "./constants";
    import { dragstate } from "./stores/drag_store";
    import { nodegraph } from "./stores/graph_store";
    import { viewport } from "./stores/viewport_store";
    import type { MyConnector } from "./types";

    export let id: MyConnector;
    export let ref: HTMLDivElement = null;
</script>

<div
    bind:this={ref}
    on:mousedown|preventDefault|stopPropagation={e => {
        e.button === DRAG_KEY &&
            dragstate.startDrag({
                drag_type: "connector",
                drag_name: id,
                drag_offset: [
                    e.pageX + $viewport.position[0],
                    e.pageY + $viewport.position[1],
                ],
                drag_callback: e =>
                    dragstate.dragConnector([
                        e.pageX + $viewport.position[0],
                        e.pageY + $viewport.position[1],
                    ]),
            });
    }}
    on:mouseup={e => {
        if (e.button !== DRAG_KEY || $dragstate.drag_type !== "connector") return;
        nodegraph.addEdge($dragstate.drag_name, id);
        dragstate.stopDrag();
    }}
    class="h-4 w-4 rounded-lg shadow-md border-2 border-white bg-blue-400 hover:bg-blue-500"
/>
