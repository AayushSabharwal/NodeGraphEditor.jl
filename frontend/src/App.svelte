<script lang="ts">
    import Stage from "./Stage.svelte";
    import { dragstate } from "./stores/drag_store";
import ZoomWidget from "./ZoomWidget.svelte";

    $: mouseuphandler = $dragstate.drag_type === null ? undefined : dragstate.stopDrag;
    let height: number, width: number;
</script>

<svelte:body on:mousemove={$dragstate.drag_callback} on:mouseup={mouseuphandler} />
<div class="w-full h-full m-0"><Stage bind:height bind:width /></div>
<div class="absolute bottom-4 left-4"><ZoomWidget {height} {width} /></div>

<style global lang="postcss">
    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    :global(body),
    :global(html) {
        margin: 0;
        padding: 0px;
        width: 100%;
        height: 100%;
        position: relative;
    }

    :global(body) {
        box-sizing: border-box !important;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans,
            Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    }
</style>
