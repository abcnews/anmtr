<script lang="ts">
  import { progress, options } from '$lib/storage';
  import StageLayer from './StageLayer.svelte';
  import type { Layer } from '../types';
  export let layers: Layer[];

  const onWheel = (ev: WheelEvent) => {
    $progress = Math.max(Math.min(1, $progress + ev.deltaY / 1000), 0);
  };
</script>

<div class="container">
  <h3
    style={`transform: translate(calc(-${$options.width / 2}px), calc(-${$options.height / 2}px - 100%))`}
    class="title"
  >
    Stage
  </h3>
  <div
    class="stage"
    bind:clientWidth={$options.width}
    bind:clientHeight={$options.height}
    on:wheel={onWheel}
    style={`width: ${$options.width}px; height: ${$options.height}px`}
  >
    {#each layers.slice().reverse() as layer (layer.id)}
      <StageLayer bind:layer stageWidth={$options.width} stageHeight={$options.height} />
    {/each}
  </div>
  <div class="dims" style={`transform: translate(calc(${$options.width / 2}px - 100%), ${$options.height / 2 + 3}px)`}>
    {$options.width} x {$options.height}
  </div>
</div>

<style lang="scss">
  .container {
    position: relative;
    height: 100%;
    width: 100%;
    overflow: auto;
  }
  .stage {
    width: 100%;
    height: 100%;
    overflow: hidden;
    border: 1px solid #ccc;
    margin: 0;
    position: absolute;
    box-sizing: initial;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    resize: both;
    box-shadow: 1px 1px 3px 0px rgba(0, 0, 0, 0.2);
    background-color: #fff;
  }
  .title {
    position: absolute;
    top: 50%;
    left: 50%;
    font-size: 1rem;
  }
  .dims {
    position: absolute;
    top: 50%;
    left: 50%;
    font-size: 0.7rem;
  }
</style>
