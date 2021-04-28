<script lang="ts">
  import { saveAs } from 'file-saver';
  import { layers } from '$lib/storage';
  import Stage from '$lib/Stage.svelte';
  import Timeline from '$lib/Timeline.svelte';
  import Player from '$lib/Player.svelte';
  import 'carbon-components-svelte/css/g10.css';
  import { Header, HeaderNav, HeaderNavItem, HeaderNavMenu } from 'carbon-components-svelte';

  let isSideNavOpen = false;
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

<Header company="Story Lab" platformName="Anmtr" bind:isSideNavOpen>
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
