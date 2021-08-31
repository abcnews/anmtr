<script lang="ts">
  import { Slider, Button, FormGroup, Popover, NumberInput } from 'carbon-components-svelte';
  import { progress } from '$lib/storage';
  import { TweenableProperty } from '../types';
  import {
    tweenablePropertyLabel,
    tweenablePropertyExtent,
    getKeyframes,
    interpolate,
    tweenablePropertyIncrement
  } from '$lib/utils';
  import type { Tween } from '../types';
  import { nanoid } from 'nanoid/non-secure';
  import TimelineKeyframe from '$lib/TimelineKeyframe.svelte';
  export let tween: Tween;

  let hovered: boolean = false;
  let time: number = 0;
  let width: number;

  const createKeyframe = (ev: MouseEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    const value = interpolate(time, getKeyframes(tween, time));
    tween.keyframes = [...tween.keyframes, { id: nanoid(), time, value }].sort((a, b) => a.time - b.time);
  };

  const deleteKeyframe = (idx: number) => {
    tween.keyframes = [...tween.keyframes.slice(0, idx), ...tween.keyframes.slice(idx + 1)];
  };

  const updateTime = (ev: MouseEvent) => {
    const { left } = (<HTMLElement>ev.target).getBoundingClientRect();
    time = (ev.clientX - left) / width;
    hovered = ev.target === ev.currentTarget;
  };
</script>

<li>
  <span class="label">{tweenablePropertyLabel(tween.property)}</span>
  <div
    class="track"
    bind:clientWidth={width}
    on:dblclick={createKeyframe}
    on:mousemove={updateTime}
    on:mouseleave={() => (hovered = false)}
  >
    <div class="time" style={`left: calc(${$progress * 100}% - 1.5px);`} />
    {#each tween.keyframes as keyframe, idx (keyframe.id)}
      <TimelineKeyframe
        bind:keyframe
        extent={tweenablePropertyExtent(tween.property)}
        increment={tweenablePropertyIncrement(tween.property)}
        onDelete={() => deleteKeyframe(idx)}
      />
    {/each}
  </div>
  <div class="hover-time" style={`left: ${time * 100}%`}>
    <Popover caret align="bottom-right" relative open={hovered}
      ><p style="padding: 0.6rem">@ {(time * 100).toFixed(1)}%</p></Popover
    >
  </div>
</li>

<style lang="scss">
  .track {
    position: relative;
    height: 0.5rem;
    background-color: #8f8f8f;
    border-radius: 0.25rem;
    margin: 1rem 0;
  }

  .label {
    position: absolute;
    font-size: 0.625rem;
    line-height: 1;
    left: 1rem;
    bottom: calc(100% + 0.2em);
  }

  .time {
    height: 110%;
    width: 3px;
    top: -5%;
    background: rgba(255, 255, 255, 0.6);
    position: absolute;
    outline: transparent 10px;
    pointer-events: none;
  }

  .hover-time {
    pointer-events: none;
    position: absolute;
    top: 0;
    width: 9.2em;
    transform: translateX(-50%);
  }

  li {
    position: relative;
    list-style-type: none;
    text-align: left;
    margin: 0;
    padding: 0;
  }
</style>
