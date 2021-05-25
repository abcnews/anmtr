import { TweenableProperty } from '../types';
import type { TKeyframe, Tween } from '../types';

export const tweenablePropertyLabel = (p: TweenableProperty) => {
  switch (p) {
    case TweenableProperty.X:
      return 'x position';
    case TweenableProperty.Y:
      return 'y position';
    case TweenableProperty.O:
      return 'opacity';
    case TweenableProperty.S:
      return 'scale';
  }
};

export const getTweenKeyframes = (
  tweens: Tween[],
  property: TweenableProperty,
  time: number
): [TKeyframe, TKeyframe] => {
  const tween = tweens.find(d => d.property === property);
  const defaultValue = property === TweenableProperty.O || property === TweenableProperty.S ? 1 : 0;
  return getKeyframes(tween, time, defaultValue);
};

export const getKeyframes = (tween: Tween, time: number, defaultValue: number = 0): [TKeyframe, TKeyframe] => {
  // If there is no tween of this type, return the default keyframes
  if (typeof tween === 'undefined') {
    return [
      { id: 'tmp', time: 0, value: defaultValue },
      { id: 'tmp', time: 1, value: defaultValue }
    ];
  }

  const from = tween.keyframes
    .filter(d => d.time <= time)
    .reduce<TKeyframe | undefined>(
      (max, d) => (typeof max === 'undefined' ? d : max.time > d.time ? max : d),
      undefined
    ) || { id: 'tmp', time: 0, value: defaultValue };

  const to = tween.keyframes
    .filter(d => d.time >= time)
    .reduce<TKeyframe | undefined>(
      (min, d) => (typeof min === 'undefined' ? d : min.time < d.time ? min : d),
      undefined
    ) || { id: 'tmp', time: 1, value: defaultValue };

  return [from, to];
};

export const interpolate = (time: number, [from, to]: [TKeyframe, TKeyframe]): number => {
  if (to.time === from.time) {
    return from.value;
  }
  const totalTime = to.time - from.time;
  const totalValue = to.value - from.value;
  const result = ((time - from.time) / totalTime) * totalValue + from.value;
  return result;
};
