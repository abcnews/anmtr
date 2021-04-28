<script lang="ts">
  import TimelineTweens from './TimelineTweens.svelte';
  import { nanoid } from 'nanoid/non-secure';
  import { tweenablePropertyLabel } from '$lib/utils';
  import { TweenableProperty } from '../types';
  import type { Layer } from '../types';
  import {
    Button,
    Checkbox,
    FormGroup,
    Modal,
    NumberInput,
    Popover,
    Select,
    SelectItem,
    TextInput
  } from 'carbon-components-svelte';
  import TrashCan16 from 'carbon-icons-svelte/lib/TrashCan16';
  import Add16 from 'carbon-icons-svelte/lib/Add16';
  import Image16 from 'carbon-icons-svelte/lib/Image16';
  import Movement16 from 'carbon-icons-svelte/lib/Movement16';
  import RowCollapse16 from 'carbon-icons-svelte/lib/RowCollapse16';
  import RowExpand16 from 'carbon-icons-svelte/lib/RowExpand16';
  import View16 from 'carbon-icons-svelte/lib/View16';

  export let layer: Layer;
  export let onDelete: (ev: MouseEvent) => void;
  export let onAdd: (ev: MouseEvent) => void;
  export let onMoveForward: (ev: MouseEvent) => void | undefined;
  export let onMoveBackward: (ev: MouseEvent) => void | undefined;

  let fileinput: HTMLInputElement;
  let files: FileList;
  let addingTween: boolean = false;
  let showViewOptions: boolean = false;

  const getFileData = async (files: FileList) => {
    if (!files) return;
    const file = files[0];
    if (!file) return;
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = e => {
      if (e && e.target) {
        layer.src = e.target.result as string;
      } else {
        throw new Error('Error reading file');
      }
    };
  };

  $: getFileData(files);

  const onAddTween = (ev: MouseEvent) => {
    addingTween = !addingTween;
  };

  const addTween = (property: TweenableProperty) => {
    layer.tweens = [
      ...(layer?.tweens || []),
      {
        property,
        keyframes: [
          { id: nanoid(), time: 0, value: 0 },
          { id: nanoid(), time: 1, value: 0 }
        ]
      }
    ];
  };

  const removeTween = (property: TweenableProperty) => {
    layer.tweens = layer.tweens.filter(d => d.property !== property);
  };

  const handlePropertyCheck = (property: TweenableProperty) => {
    typeof layer.tweens.find(t => t.property === property) === 'undefined' ? addTween(property) : removeTween(property);
  };
</script>

<div class="bx--row layer">
  <div class="add">
    <Button
      kind="ghost"
      size="small"
      iconDescription="Add layer"
      on:click={onAdd}
      icon={Add16}
      tooltipAlignment="end"
      tooltipPosition="right"
    />
  </div>
  <div class="bx--col-lg-3 properties">
    <input type="text" bind:value={layer.name} class="bx--text-input bx--text-input--sm" />

    <div class="actions">
      <Button
        tooltipAlignment="start"
        kind="ghost"
        size="small"
        iconDescription="Load image"
        icon={Image16}
        on:click={() => fileinput.click()}
      />
      <Button
        tooltipAlignment="start"
        kind="ghost"
        size="small"
        iconDescription="Tweens"
        icon={Movement16}
        on:click={onAddTween}
      />
      <Popover
        closeOnOutsideClick
        open={addingTween}
        on:click:outside={() => {
          addingTween = false;
        }}
      >
        <div class="popover">
          {#each Object.values(TweenableProperty) as property}
            <Checkbox
              on:check={() => handlePropertyCheck(property)}
              labelText={tweenablePropertyLabel(property)}
              checked={typeof layer.tweens.find(t => t.property === property) !== 'undefined'}
            />
          {/each}
        </div>
      </Popover>
      <Button
        tooltipAlignment="start"
        kind="ghost"
        size="small"
        iconDescription="Move layer forward"
        icon={RowCollapse16}
        disabled={typeof onMoveForward === 'undefined'}
        on:click={onMoveForward}
      />
      <Button
        tooltipAlignment="start"
        kind="ghost"
        size="small"
        iconDescription="Move layer backward"
        icon={RowExpand16}
        disabled={typeof onMoveBackward === 'undefined'}
        on:click={onMoveBackward}
      />
      <Button
        tooltipAlignment="start"
        kind="ghost"
        size="small"
        iconDescription="Layer display options"
        icon={View16}
        on:click={() => (showViewOptions = !showViewOptions)}
      />
      <Modal bind:open={showViewOptions} modalHeading="View options" size="sm" passiveModal>
        <FormGroup>
          <Checkbox
            labelText="Constrain width"
            checked={!!layer.constrainWidth}
            on:check={() => (layer.constrainWidth = !layer.constrainWidth)}
          />
        </FormGroup>

        <FormGroup>
          <NumberInput
            disabled={!layer.constrainWidth}
            min={0}
            bind:value={layer.widthConstraint.min}
            invalidText="Number must be positive"
            helperText="Minimum width of image in pixels"
            label="Minimum width"
          />
        </FormGroup>
        <FormGroup>
          <NumberInput
            disabled={!layer.constrainWidth}
            min={0}
            max={100}
            bind:value={layer.widthConstraint.target}
            invalidText="Number must be between 0 and 100"
            helperText="Ideal width of image as % of stage width"
            label="Target width"
          />
        </FormGroup>
        <FormGroup>
          <NumberInput
            disabled={!layer.constrainWidth}
            min={0}
            bind:value={layer.widthConstraint.max}
            invalidText="Number must be positive"
            helperText="Maximum width of image in pixels"
            label="Maximum width"
          />
        </FormGroup>

        <FormGroup>
          <Checkbox
            labelText="Constrain height"
            checked={!!layer.constrainHeight}
            on:check={() => (layer.constrainHeight = !layer.constrainHeight)}
          />
        </FormGroup>

        <FormGroup>
          <NumberInput
            disabled={!layer.constrainHeight}
            min={0}
            bind:value={layer.heightConstraint.min}
            invalidText="Number must be positive"
            helperText="Minimum height of image in pixels"
            label="Minimum height"
          />
        </FormGroup>
        <FormGroup>
          <NumberInput
            disabled={!layer.constrainHeight}
            min={0}
            max={100}
            bind:value={layer.heightConstraint.target}
            invalidText="Number must be between 0 and 100"
            helperText="Ideal height of image as % of stage height"
            label="Target height"
          />
        </FormGroup>
        <FormGroup>
          <NumberInput
            disabled={!layer.constrainHeight}
            min={0}
            bind:value={layer.heightConstraint.max}
            invalidText="Number must be positive"
            helperText="Maximum height of image in pixels"
            label="Maximum height"
          />
        </FormGroup>

        <Select
          labelText="Object fit"
          bind:selected={layer.objectFit}
          disabled={!(layer.constrainHeight && layer.constrainWidth)}
        >
          <SelectItem value="none" text="none" />
          <SelectItem value="fill" text="fill" />
          <SelectItem value="contain" text="contain" />
          <SelectItem value="cover" text="cover" />
        </Select>
      </Modal>
      <Button
        tooltipAlignment="start"
        kind="danger-ghost"
        size="small"
        iconDescription="Delete"
        textContent="Delete layer"
        icon={TrashCan16}
        on:click={onDelete}
      />
      <input type="file" style="display: none" bind:this={fileinput} accept=".jpg, .jpeg, .png" bind:files />
    </div>
  </div>
  <div class="bx--col-lg-13">
    {#if layer?.tweens?.length}
      <TimelineTweens bind:tweens={layer.tweens} />
    {/if}
  </div>
</div>

<style lang="scss">
  .layer {
    position: relative;
    margin: 1rem 0;
    border-top: 1px solid #ccc;
    padding-top: 1rem;
    &:last-child {
      padding-bottom: 1rem;
      border-bottom: 1px solid #ccc;
    }
  }

  .add {
    position: absolute;
    left: 50%;
    top: 0;
    background: #f4f4f4;
    transform: translate(-50%, -50%);
  }

  .popover {
    padding: 0.5rem;
  }

  .actions {
    position: relative;
    margin-top: 0.5rem;
  }
</style>
