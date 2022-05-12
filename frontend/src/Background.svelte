<script lang="ts">
    import { viewport } from "./stores/viewport_store";

    const pattern_size = [2000, 2000];
    $: base_pos = [
        Math.floor($viewport.position[0] / pattern_size[0]),
        Math.floor($viewport.position[1] / pattern_size[1]),
    ];
    $: tile_positions = [
        [base_pos[0] - 1, base_pos[1] - 1],
        [base_pos[0], base_pos[1] - 1],
        [base_pos[0] + 1, base_pos[1] - 1],
        [base_pos[0] - 1, base_pos[1]],
        [...base_pos],
        [base_pos[0] + 1, base_pos[1]],
        [base_pos[0] - 1, base_pos[1] + 1],
        [base_pos[0], base_pos[1] + 1],
        [base_pos[0] + 1, base_pos[1] + 1],
    ];
</script>

<defs>
    <pattern id="smallGrid" width="8" height="8" patternUnits="userSpaceOnUse">
        <path d="M 8 0 L 0 0 0 8" fill="none" stroke="gray" stroke-width="0.5" />
    </pattern>
    <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
        <rect width="80" height="80" fill="url(#smallGrid)" />
        <path d="M 80 0 L 0 0 0 80" fill="none" stroke="gray" stroke-width="1" />
    </pattern>
</defs>
{#each tile_positions as pos, i (i)}
    <rect
        width={pattern_size[0]}
        height={pattern_size[1]}
        x={pos[0] * pattern_size[0]}
        y={pos[1] * pattern_size[1]}
        fill="url(#grid)"
    />
{/each}
