<script lang="ts">
    export let src: number[];
    export let dst: number[];
</script>

{#if src !== null && src !== undefined && dst !== null && src !== undefined}
    <path
        d={`M ${src[0]} ${src[1]} c ${
            -(dst[0] - src[0]) / 5
        } ${0}, ${+(dst[0] - src[0]) / 5} ${0}, ${dst[0] - src[0]} ${dst[1] - src[1]}`}
        stroke="black"
        fill="transparent"
    />
{/if}
