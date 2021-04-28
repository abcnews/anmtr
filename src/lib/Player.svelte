<script lang="ts">
  import { progress } from '$lib/storage';
  import { Button } from 'carbon-components-svelte';
  import { handle } from '$lib/handle';
  import Pause16 from 'carbon-icons-svelte/lib/Pause16';
  import Play16 from 'carbon-icons-svelte/lib/Play16';
  let playing: number | void;
  let dragging: boolean = false;
  const stop = () => {
    playing = window.clearTimeout(playing || null);
  };

  const play = () => {
    $progress = (($progress * 1000 + 1) % 1000) / 1000;
    playing = window.setTimeout(play, 10);
  };
</script>

<div class="bx--row">
  <div class="bx--col-lg-3">
    <Button icon={playing ? Pause16 : Play16} on:click={() => (playing ? stop() : play())} />
  </div>
  <div class="bx--col-lg-13">
    <div class="track">
      <div
        use:handle
        on:dragstart={() => (dragging = true)}
        on:drag={({ detail: time }) => ($progress = time)}
        on:dragend={() => (dragging = false)}
        class="time"
        class:active={dragging}
        style={`left: calc(${$progress * 100}% - 0.25rem);`}
      />
    </div>
  </div>
</div>

<style lang="scss">
  .track {
    position: relative;
    height: 0.5rem;
    background-color: #ccc;
    border-radius: 0.25rem;
    margin: 1.25rem;
  }

  .time {
    height: 1rem;
    width: 1rem;
    border-radius: 50%;
    background: #fff;
    position: absolute;
    top: -0.25rem;
    outline: transparent 10px;
    z-index: 10;
    transform-origin: center;
    transition: transform 0.2s;
    &.active,
    &:hover {
      cursor: pointer;
      transform: scale(1.3);
    }
  }
</style>
