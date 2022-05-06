<script lang="ts">
    import Connector from "./Connector.svelte";
    import { dragstate } from "./stores/drag_store";
    import { nodegraph } from "./stores/graph_store";
    import { viewport } from "./stores/viewport_store";
    export let name: string;

    $: curr = $nodegraph.nodes[name];

    function startDrag(e1: MouseEvent) {
        dragstate.startDrag({
            drag_type: "node",
            drag_name: name,
            drag_offset: [e1.offsetX, e1.offsetY],
            drag_callback: e =>
                nodegraph.dragNodeTo($dragstate.drag_name, [
                    e.pageX - $dragstate.drag_offset[0] + $viewport.position[0],
                    e.pageY - $dragstate.drag_offset[1] + $viewport.position[1],
                ]),
        });
    }
</script>

<div
    class="h-24 w-40 absolute"
    style={`left:${curr.position[0] - $viewport.position[0]}px; top:${
        curr.position[1] - $viewport.position[1]
    }px;`}
>
    <div class="h-20 w-4 my-2 -left-2 absolute">
        {#each Array(curr.inputs).fill(0) as key (key)}
            <Connector name={`${curr.name}_i_${key}`} />
        {/each}
    </div>
    <div class="h-20 w-4 my-2 -right-2 absolute" />
    <div
        class="bg-gray-400 rounded-md shadow-sm p-2 min-h-full min-w-full text-center"
        on:mousedown|preventDefault|stopPropagation={startDrag}
    >
        <span class="text-gray-900 font-sans text-base">{curr.name}</span>
    </div>
</div>
