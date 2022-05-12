<script lang="ts">
    import { dragstate } from "./stores/drag_store";

    import Stage from "./Stage.svelte";

    $: mouseuphandler = $dragstate.drag_type === null ? undefined : dragstate.stopDrag;
</script>

<!-- <svelte:body  /> -->
<div on:mousemove={$dragstate.drag_callback} on:mouseup={mouseuphandler} class="w-full h-full m-0"><Stage /></div>

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
