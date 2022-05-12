<script lang="ts">
    import { nodegraph } from "./stores/graph_store";

    export let name: string;
    export let ref: HTMLDivElement = null;
</script>

<div bind:this={ref}
    class="h-4 w-4 rounded-lg shadow-md border-2 border-white bg-blue-400 hover:bg-blue-500"
/>
