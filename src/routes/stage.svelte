<script lang="ts">
  import StageLayer from '$lib/StageLayer.svelte';
  import { progress, options } from '$lib/storage';
  import { layers } from '$lib/storage';
  console.log('$layers :>> ', $layers);
</script>

{#each $layers.slice().reverse() as layer (layer.id)}
  <StageLayer {layer} stageWidth={$options.width} stageHeight={$options.height} />
{/each}
