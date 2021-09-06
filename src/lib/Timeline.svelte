<script lang="ts">
  import TimelineLayer from './TimelineLayer.svelte';
  import { nanoid } from 'nanoid/non-secure';
  import type { Layer } from './types';
  import Add16 from 'carbon-icons-svelte/lib/Add16';
  import { Button } from 'carbon-components-svelte';
  import { hiddenLayers } from './storage';
  import View16 from 'carbon-icons-svelte/lib/View16';
  import ViewOff16 from 'carbon-icons-svelte/lib/ViewOff16';

  export let layers: Layer[];
  const addLayer = (idx: number = 0) => {
    layers = [
      ...layers.slice(0, idx),
      {
        name: `Layer ${layers.length + 1}`,
        id: nanoid(),
        tweens: [],
        constrainWidth: false,
        constrainHeight: false,
        widthConstraint: { min: 0, max: 100, target: 100 },
        heightConstraint: { min: 0, max: 100, target: 100 },
        objectFit: 'fill'
      },
      ...layers.slice(idx)
    ];
  };

  const deleteLayer = (id: string) => {
    layers = layers.filter(d => d.id !== id);
  };

  const moveForward = (idx: number) => {
    if (idx <= 0) return;
    layers = [...layers.slice(0, idx - 1), layers[idx], layers[idx - 1], ...layers.slice(idx + 1)];
  };

  const moveBackward = (idx: number) => {
    if (idx >= layers.length - 1) return;
    layers = [...layers.slice(0, idx), layers[idx + 1], layers[idx], ...layers.slice(idx + 2)];
  };
</script>

<div class="container">
  <div class="bx--row" style="margin: 1rem 0;">
    <div class="bx--col-lg-13">
      <h5>Layers</h5>
    </div>
    <div class="bx--col-lg-3" style="text-align: right;">
      <Button
        tooltipAlignment="end"
        kind="ghost"
        size="small"
        iconDescription="Hide all layers"
        icon={ViewOff16}
        on:click={() => ($hiddenLayers = layers.map(d => d.id))}
      />
      <Button
        tooltipAlignment="end"
        kind="ghost"
        size="small"
        iconDescription="Show all layers"
        icon={View16}
        on:click={() => ($hiddenLayers = [])}
      />
    </div>
  </div>
  <div>
    {#each layers as layer, idx (layer.id)}
      <TimelineLayer
        bind:layer
        onDelete={() => deleteLayer(layer.id)}
        onAdd={() => addLayer(idx)}
        onMoveForward={idx <= 0 ? undefined : () => moveForward(idx)}
        onMoveBackward={idx >= layers.length - 1 ? undefined : () => moveBackward(idx)}
      />
    {/each}
  </div>
  <div class="add">
    {#if layers.length === 0}
      <Button
        kind="ghost"
        size="small"
        iconDescription="Add layer"
        on:click={() => addLayer(layers.length)}
        icon={Add16}
        tooltipAlignment="end"
        tooltipPosition="right">Add a layer</Button
      >
    {:else}
      <Button
        kind="ghost"
        size="small"
        iconDescription="Add layer"
        on:click={() => addLayer(layers.length)}
        icon={Add16}
        tooltipAlignment="end"
        tooltipPosition="right"
      />
    {/if}
  </div>
</div>

<style lang="scss">
  .container {
    margin-bottom: 20vh;
    position: relative;
  }

  .add {
    position: absolute;
    left: 50%;
    bottom: 0;
    background-color: #f4f4f4;
    transform: translate(-50%, 50%);
  }
</style>
