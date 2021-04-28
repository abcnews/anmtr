import { TweenableProperty } from '../types';
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
