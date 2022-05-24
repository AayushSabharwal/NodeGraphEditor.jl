<script lang="ts">
    import { ZOOM_STEP } from "./constants";

    import { viewport } from "./stores/viewport_store";

    export let height: number, width: number;
</script>

<div class="w-10 h-22">
    <button
        class="w-10 h-8 rounded-t-md text-lg bg-gray-300 hover:bg-gray-400 active:bg-gray-500 transition duration-200 focus:border-none focus:outline-none"
        on:click={() => viewport.zoom(ZOOM_STEP, [height / 2, width / 2])}
    >
        +
    </button>
    <div class="w-10 h-6 bg-gray-300 text-center font-sans text-lg">
        {$viewport.zoom}
    </div>
    <button
        class="w-10 h-8 rounded-b-md text-lg bg-gray-300 hover:bg-gray-400 active:bg-gray-500 transition duration-200 focus:border-none focus:outline-none"
        on:click={() => viewport.zoom(-ZOOM_STEP, [height / 2, width / 2])}
    >
        –
    </button>
</div>
