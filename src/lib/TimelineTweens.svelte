<script lang="ts">
  import TimelineTween from './TimelineTween.svelte';
  import type { Tween } from '../types';
  export let tweens: Tween[];

  $: tweens = tweens.filter(d => d.keyframes.length > 0);
</script>

<ul class="tweens">
  {#each tweens as tween}
    <TimelineTween bind:tween />
  {/each}
</ul>

<style lang="scss">
  .tweens {
    margin: 0;
    padding: 0;
  }
</style>
