<script lang="ts">
  import type { Layer } from './types';
  import { getStyle } from './utils';

  export let layer: Layer;
  export let stageWidth: number;
  export let stageHeight: number;
  export let progress: number = 0;

  let layerWidth: number;
  let layerHeight: number;

  let style: ReturnType<typeof getStyle>;
  $: style = getStyle(
    layer,
    progress,
    { width: stageWidth, height: stageHeight },
    { width: layerWidth, height: layerHeight }
  );
</script>

{#if style}
  <div class="layer" bind:clientWidth={layerWidth} bind:clientHeight={layerHeight}>
    {#if layer.src}
      <img {style} src={layer.src} alt={layer.name} />
    {:else}
      <div {style} class="placeholder">{layer.name}</div>
    {/if}
  </div>
{/if}

<style lang="scss">
  .layer {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .placeholder {
    width: 100px;
    height: 100px;
    border: 1px solid rosybrown;
  }
</style>
