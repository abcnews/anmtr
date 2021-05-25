<script lang="ts">
  import { saveAs } from 'file-saver';
  import { layers } from '$lib/storage';
  import Stage from '$lib/Stage.svelte';
  import Timeline from '$lib/Timeline.svelte';
  import Player from '$lib/Player.svelte';
  import {
    Button,
    ButtonSet,
    Header,
    HeaderAction,
    HeaderNav,
    HeaderNavItem,
    HeaderNavMenu,
    HeaderUtilities,
    NumberInput
  } from 'carbon-components-svelte';

  import { options } from '$lib/storage';

  let isOpen = false;
  let importFile: HTMLInputElement;
  let files: FileList;

  const getFileData = async (files: FileList) => {
    if (!files) return;
    const file = files[0];
    if (!file) return;
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = e => {
      if (e && e.target) {
        $layers = JSON.parse(e.target.result as string);
      } else {
        throw new Error('Error reading file');
      }
    };
  };
  $: getFileData(files);
</script>

<Header company="Story Lab" platformName="Anmtr">
  <HeaderNav>
    <HeaderNavMenu text="File">
      <HeaderNavItem
        on:click={() =>
          saveAs(new Blob([JSON.stringify($layers)], { type: 'application/json;charset=utf-8' }), 'animation.json')}
        href="/"
        text="Export"
      />
      <HeaderNavItem on:click={() => importFile.click()} href="/" text="Import" />
    </HeaderNavMenu>
  </HeaderNav>
  <HeaderUtilities>
    <HeaderAction bind:isOpen>
      <div class="form-field">
        <NumberInput label="Stage scroll distance (px)" bind:value={$options.stageScrollDistance} />
      </div>
    </HeaderAction>
  </HeaderUtilities>
  <input type="file" bind:this={importFile} style="display: none;" accept=".json, .anmtr" bind:files />
</Header>

<main>
  <div class="stage">
    <Stage bind:layers={$layers} />
  </div>

  <div class="bx--grid--full-width timeline">
    <Timeline bind:layers={$layers} />
  </div>

  <div class="bx--grid--full-width player">
    <Player />
  </div>
</main>

<style lang="scss">
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
      'Helvetica Neue', sans-serif;
  }

  :global(body) {
    margin: 0;
    padding: 0;
  }

  .stage {
    padding-top: 3rem;
  }

  .timeline {
    overflow: auto;
    box-shadow: 0 0 10px 0px rgba(0, 0, 0, 0.2);
  }

  .form-field {
    padding: 1rem;
    --cds-text-02: #fff;
  }

  .player {
    background: #000;
  }

  main {
    padding: 0;
    margin: 0;
    overflow: hidden;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: calc(60vh - 3rem) 40vh 3rem;
    height: 100vh;
  }
</style>
