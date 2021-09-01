<script lang="ts">
  import { onMount } from 'svelte';
  import '../app.scss';
  import 'carbon-components-svelte/css/all.css';

  let ready: boolean = false;
  onMount(() => (ready = true));
</script>

{#if ready}
  <slot />
{/if}
