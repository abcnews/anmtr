<script lang="ts">
  import { progress, hiddenLayers } from './storage';
  import type { Layer, TKeyframe } from '../types';
  import { TweenableProperty } from '../types';
  import { interpolate, getTweenKeyframes } from '$lib/utils';

  export let layer: Layer;
  export let stageWidth: number;
  export let stageHeight: number;

  let layerWidth: number;
  let layerHeight: number;

  // x — default is zero
  let x: number;
  $: x = interpolate($progress, getTweenKeyframes(layer.tweens, TweenableProperty.X, $progress));

  // y - default is zero
  let y: number;
  $: y = interpolate($progress, getTweenKeyframes(layer.tweens, TweenableProperty.Y, $progress));

  // o - default is one
  let o: number;
  $: o = interpolate($progress, getTweenKeyframes(layer.tweens, TweenableProperty.O, $progress));

  // s - default is one
  let s: number;
  $: s = interpolate($progress, getTweenKeyframes(layer.tweens, TweenableProperty.S, $progress));

  let transform: string;
  $: transform = `translate(${x * stageWidth - layerWidth * -x}px, ${
    y * stageHeight - layerHeight * -y
  }px) scale(${s})`;

  let widthStyle: string;
  $: widthStyle = layer.constrainWidth
    ? `width: clamp(${layer.widthConstraint.min}px, ${stageWidth * (layer.widthConstraint.target / 100)}px, ${
        layer.widthConstraint.max
      }px);`
    : '';

  let heightStyle: string;
  $: heightStyle = layer.constrainHeight
    ? `height: clamp(${layer.heightConstraint.min}px, ${stageHeight * (layer.heightConstraint.target / 100)}px, ${
        layer.heightConstraint.max
      }px);`
    : '';

  let objectFitStyle: string;
  $: objectFitStyle = layer.constrainHeight && layer.constrainWidth ? `object-fit: ${layer.objectFit};` : '';

  let style: string;
  $: style = `transform: ${transform}; opacity: ${o}; ${widthStyle}${heightStyle}${objectFitStyle}`;

  let invisible: boolean;
  $: invisible = x <= -0.5 || x >= 0.5 || y <= -0.5 || y >= 0.5 || o === 0 || s === 0;
</script>

{#if !invisible && !$hiddenLayers.includes(layer.id)}
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
