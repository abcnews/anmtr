<script lang="ts">
  import { Slider, Button, FormGroup, Popover } from 'carbon-components-svelte';
  import { progress } from '$lib/storage';
  import { TweenableProperty } from '../types';
  import { tweenablePropertyLabel, getKeyframes, interpolate } from '$lib/utils';
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
    <div class="time" style={`left: ${$progress * 100}%;`} />
    {#each tween.keyframes as keyframe, idx (keyframe.id)}
      <TimelineKeyframe bind:keyframe>
        <div
          on:mousedown={e => e.stopPropagation()}
          on:touchstart={e => e.stopPropagation()}
          on:dblclick={e => e.stopPropagation()}
          class="keyframe-detail"
          style={`transform: translate(${keyframe.time * -100}%)`}
        >
          <h3>{keyframe.value.toFixed(2)}@{(keyframe.time * 100).toFixed(1)}%</h3>
          <FormGroup>
            <Slider
              type="range"
              min={tween.property === TweenableProperty.X || tween.property === TweenableProperty.Y ? -0.5 : 0}
              max={tween.property === TweenableProperty.X || tween.property === TweenableProperty.Y ? 0.5 : 1}
              step={0.01}
              bind:value={keyframe.value}
              hideTextInput
            />
          </FormGroup>
          <Button on:click={() => deleteKeyframe(idx)} kind="danger-ghost">Delete</Button>
        </div>
      </TimelineKeyframe>
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
    /* text-transform: uppercase; */
    font-size: 0.625rem;
    line-height: 1;
    left: 1rem;
    bottom: calc(100% + 0.2em);
  }

  .time {
    height: 110%;
    width: 3px;
    top: -5%;
    background: #fff;
    position: absolute;
    outline: transparent 10px;
  }

  .hover-time {
    pointer-events: none;
    position: absolute;
    top: 0;
    width: 9.2em;
    transform: translateX(-50%);
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

  li {
    position: relative;
    list-style-type: none;
    text-align: left;
    margin: 0;
    padding: 0;
  }
</style>
