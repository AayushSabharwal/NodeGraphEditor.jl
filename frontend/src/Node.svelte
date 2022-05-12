<script lang="ts">
    import Connector from "./Connector.svelte";
    import { DRAG_KEY } from "./constants";
    import { dragstate } from "./stores/drag_store";
    import { nodegraph } from "./stores/graph_store";
    import { connector_positions } from "./stores/positions_store";
    import { viewport } from "./stores/viewport_store";
    export let id: number;

    $: curr = $nodegraph.nodes[id];

    function startDrag(e1: MouseEvent) {
        if (e1.button !== DRAG_KEY) return;
        dragstate.startDrag({
            drag_type: "node",
            drag_name: id,
            drag_offset: [e1.offsetX, e1.offsetY],
            drag_callback: e =>
                typeof $dragstate.drag_name === "number" &&
                nodegraph.dragNodeTo($dragstate.drag_name, [
                    e.pageX - $dragstate.drag_offset[0] + $viewport.position[0],
                    e.pageY - $dragstate.drag_offset[1] + $viewport.position[1],
                ]),
        });
    }

    let left_container: HTMLDivElement = null;
    let right_container: HTMLDivElement = null;
    let left_conns: (HTMLDivElement | null)[] | null = null;
    let right_conns: (HTMLDivElement | null)[] | null = null;
    $: if (curr !== undefined && curr !== null) {
        if (left_conns === null || left_conns.length !== curr.inputs)
            left_conns = Array(curr.inputs).fill(null);
        if (right_conns === null || right_conns.length !== curr.inputs)
            right_conns = Array(curr.inputs).fill(null);
    }

    $: if (left_container !== null) {
        left_conns.map((conn, i) => {
            if (conn === null) return;

            connector_positions.setConnectorPosition(
                { node: curr.id, type: "input", index: i },
                [
                    curr.position[0] +
                        left_container.offsetLeft +
                        conn.offsetLeft +
                        conn.offsetWidth / 2,
                    curr.position[1] +
                        left_container.offsetTop +
                        conn.offsetTop +
                        conn.offsetHeight / 2,
                ]
            );
        });
    }
    
    $: if (right_container !== null) {
        right_conns.map((conn, i) => {
            if (conn === null) return;

            connector_positions.setConnectorPosition(
                { node: curr.id, type: "output", index: i },
                [
                    curr.position[0] +
                        right_container.offsetLeft +
                        conn.offsetLeft +
                        conn.offsetWidth / 2,
                    curr.position[1] +
                        right_container.offsetTop +
                        conn.offsetTop +
                        conn.offsetHeight / 2,
                ]
            );
        });
    }
</script>

<div
    class="h-24 w-40 absolute"
    style={`left:${curr.position[0] - $viewport.position[0]}px; top:${
        curr.position[1] - $viewport.position[1]
    }px;`}
>
    <div class="h-20 w-4 my-2 -left-2 absolute" bind:this={left_container}>
        {#each Array(curr.inputs).fill(0) as _, key (key)}
            <Connector bind:ref={left_conns[key]} name={`${curr.name}_i_${key + 1}`} />
        {/each}
    </div>
    <div class="h-20 w-4 my-2 -right-2 absolute" bind:this={right_container}>
        {#each Array(curr.outputs).fill(0) as _, key (key)}
            <Connector bind:ref={right_conns[key]} name={`${curr.name}_o_${key + 1}`} />
        {/each}
    </div>
    <div
        class="bg-gray-400 rounded-md shadow-sm p-2 min-h-full min-w-full text-center"
        on:mousedown|preventDefault|stopPropagation={startDrag}
    >
        <span class="text-gray-900 font-sans text-base">{curr.name}</span>
    </div>
</div>
