import { Layer, TweenableProperty } from '../types';
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
    case TweenableProperty.B:
      return 'blur';
    case TweenableProperty.RX:
      return 'x rotate';
    case TweenableProperty.RY:
      return 'y rotate';
    case TweenableProperty.RZ:
      return 'z rotate';
  }
};

export const tweenablePropertyExtent = (p: TweenableProperty): [number, number] => {
  switch (p) {
    case TweenableProperty.X:
    case TweenableProperty.Y:
      return [-0.5, 0.5];
    case TweenableProperty.O:
    case TweenableProperty.S:
      return [0, 1];
    case TweenableProperty.B:
      return [0, 100];
    case TweenableProperty.RX:
    case TweenableProperty.RY:
    case TweenableProperty.RZ:
      return [0, 360];
  }
};

export const tweenablePropertyIncrement = (p: TweenableProperty): number => {
  switch (p) {
    case TweenableProperty.X:
    case TweenableProperty.Y:
    case TweenableProperty.O:
    case TweenableProperty.S:
      return 0.01;
    case TweenableProperty.B:
    case TweenableProperty.RX:
    case TweenableProperty.RY:
    case TweenableProperty.RZ:
      return 1;
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

export const getStyle = (
  layer: Layer,
  progress: number,
  { width: stageWidth, height: stageHeight }: { width: number; height: number },
  { width: layerWidth, height: layerHeight }: { width: number; height: number }
) => {
  let interpolatedValues: { [key in TweenableProperty]?: number } = {};

  for (const prop in TweenableProperty) {
    interpolatedValues[TweenableProperty[prop]] = interpolate(
      progress,
      getTweenKeyframes(layer.tweens, TweenableProperty[prop], progress)
    );
  }

  const { x, y, o, s, b, rx, ry, rz } = interpolatedValues;

  let transform: string = `translate(${x * stageWidth - layerWidth * -x}px, ${
    y * stageHeight - layerHeight * -y
  }px) scale(${s}) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`;

  let widthStyle: string = layer.constrainWidth
    ? `width: clamp(${layer.widthConstraint.min}px, ${stageWidth * (layer.widthConstraint.target / 100)}px, ${
        layer.widthConstraint.max
      }px);`
    : '';

  let heightStyle: string = layer.constrainHeight
    ? `height: clamp(${layer.heightConstraint.min}px, ${stageHeight * (layer.heightConstraint.target / 100)}px, ${
        layer.heightConstraint.max
      }px);`
    : '';

  let filterStyle: string = `filter: blur(${b}px);`;

  let objectFitStyle: string = layer.constrainHeight && layer.constrainWidth ? `object-fit: ${layer.objectFit};` : '';

  let style: string = `transform: ${transform}; opacity: ${o}; ${widthStyle}${heightStyle}${objectFitStyle}${filterStyle}`;

  let invisible: boolean = x <= -0.5 || x >= 0.5 || y <= -0.5 || y >= 0.5 || o === 0 || s === 0;

  return !invisible ? style : false;
};
