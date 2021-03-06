import { writable } from 'svelte/store';
import type { Layer } from './types';
type LayoutState = {
  width: number;
  height: number;
  stageScrollDistance: number;
};

const getLocalStorage = (id: string) => {
  try {
    return JSON.parse(localStorage[`tweener:${id}`]);
  } catch (e) {}
};

const getStore = <T>(id: string, init: T) => {
  const store = writable<T>(getLocalStorage(id) || init);
  if (typeof window !== 'undefined')
    window && localStorage && store.subscribe(value => (localStorage[`tweener:${id}`] = JSON.stringify(value)));
  return store;
};

export const layers = getStore<Layer[]>('layers', []);
export const options = getStore<LayoutState>('layout', { width: 400, height: 600, stageScrollDistance: 1000 });
export const hiddenLayers = getStore<string[]>('hiddenLayers', []);
export const progress = writable(0);
