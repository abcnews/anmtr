<script lang="ts">
  import { progress, hiddenLayers } from './storage';
  import { default as LayerComponent } from './Layer.svelte';
  import type { Layer } from './types';

  export let layer: Layer;
  export let stageWidth: number;
  export let stageHeight: number;
</script>

{#if !$hiddenLayers.includes(layer.id)}
  <LayerComponent {stageWidth} {stageHeight} progress={$progress} {layer} />
{/if}
