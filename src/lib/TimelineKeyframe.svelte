<script lang="ts">
  import type { TKeyframe } from './types';
  import { handle } from './handle';
  import { clickOutside } from './outside';
  import { Button, FormGroup, NumberInput } from 'carbon-components-svelte';

  let dragging: boolean = false;
  let active: boolean = false;

  export let keyframe: TKeyframe;
  export let extent: [number, number];
  export let increment: number = 0.01;
  export let onDelete: () => void;
</script>

<div
  use:clickOutside
  on:click_outside={() => (active = false)}
  class="keyframe"
  style={`left: calc(${keyframe.time * 100}% - 0.5rem)`}
  use:handle
  on:dragstart={() => (dragging = true)}
  on:drag={({ detail: time }) => (keyframe = { ...keyframe, time: Math.round(time * 1000) / 1000 })}
  on:dragend={() => (dragging = false)}
>
  <div style="width: 100%; height: 100%;">
    {#if active}
      <div
        on:mousedown={e => e.stopPropagation()}
        on:touchstart={e => e.stopPropagation()}
        on:dblclick={e => e.stopPropagation()}
        class="keyframe-detail"
        style={`transform: translate(${keyframe.time * -100}%); min-width: 16rem`}
      >
        <h3>{keyframe.value.toFixed(2)} @ {(keyframe.time * 100).toFixed(1)}%</h3>
        <FormGroup>
          <NumberInput bind:value={keyframe.value} min={extent[0]} max={extent[1]} step={increment} />
        </FormGroup>
        <Button on:click={onDelete} kind="danger-ghost">Delete</Button>
      </div>
    {/if}
  </div>
  <div
    class="handle"
    class:dragging
    class:active
    on:click={e => {
      e.stopPropagation();
      active = true;
    }}
  />
</div>

<style lang="scss">
  .keyframe {
    position: absolute;
  }
  .handle {
    position: absolute;
    top: -0.25rem;
    width: 1rem;
    height: 1rem;
    border-radius: 0.5rem;
    background-color: #3f3f3f;
    transition: transform 0.2s;
    transform-origin: center;
    cursor: pointer;
    &:hover,
    &.dragging,
    &.active {
      cursor: pointer;
      transform: scale(1.3);
    }
    &.active {
      background-color: #0353e9;
    }
  }
  .keyframe-detail {
    position: absolute;
    top: calc(105% + 20px);
    left: 50%;
    transform: translate(-50%);
    background: #fff;
    padding: 10px;
    border-radius: 4px;
    box-shadow: 0 2px 4px 2px rgba(0, 0, 0, 0.2);
    z-index: 2;
  }
</style>
