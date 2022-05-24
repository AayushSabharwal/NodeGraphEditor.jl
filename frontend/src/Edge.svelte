<script lang="ts">
    import { DEFAULT_EDGE_CONTROL_OFFSET } from "./constants";

    import type { ConnectorType } from "./types";

    export let src: number[];
    export let dst: number[];
    export let src_side: ConnectorType;
    export let dst_side: ConnectorType;
</script>

{#if src !== null && src !== undefined && dst !== null && src !== undefined}
    <path
        d={`M ${src[0]} ${src[1]} c ${
            src_side === "input"
                ? -DEFAULT_EDGE_CONTROL_OFFSET
                : DEFAULT_EDGE_CONTROL_OFFSET
        } ${0}, ${
            dst[0] - src[0] + dst_side === "input"
                ? -DEFAULT_EDGE_CONTROL_OFFSET
                : DEFAULT_EDGE_CONTROL_OFFSET
        } ${dst[1] - src[1]}, ${dst[0] - src[0]} ${dst[1] - src[1]}`}
        stroke="black"
        fill="transparent"
    />
{/if}
