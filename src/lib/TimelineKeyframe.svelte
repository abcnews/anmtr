<script lang="ts">
  import type { TKeyframe } from 'src/types';
  import { handle } from '$lib/handle';
  import { clickOutside } from '$lib/outside';

  let dragging: boolean = false;
  let active: boolean = false;
  export let keyframe: TKeyframe;
</script>

<div
  use:clickOutside
  on:click_outside={() => (active = false)}
  class="keyframe"
  style={`left: calc(${keyframe.time * 100}% - 0.25rem)`}
  use:handle
  on:dragstart={() => (dragging = true)}
  on:drag={({ detail: time }) => (keyframe = { ...keyframe, time: Math.round(time * 1000) / 1000 })}
  on:dragend={() => (dragging = false)}
>
  <div style="width: 100%; height: 100%;">
    {#if active}
      <slot />
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
</style>
