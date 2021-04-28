export const handle = (el: HTMLElement) => {
  const onStart = getOnStart(el);

  el.addEventListener('touchstart', onStart);
  el.addEventListener('mousedown', onStart);
  return {
    destroy() {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('mousedown', onStart);
    }
  };
};

const getOnStart = (el: HTMLElement) => {
  const onMove = getOnMove(el);

  return function (e: MouseEvent | TouchEvent) {
    e.preventDefault();
    el.dispatchEvent(new CustomEvent('dragstart'));

    const moveEvent = 'touches' in e ? 'touchmove' : 'mousemove';
    const upEvent = 'touches' in e ? 'touchend' : 'mouseup';

    document.addEventListener(moveEvent, onMove);
    document.addEventListener(upEvent, onUp);

    function onUp(e: MouseEvent | TouchEvent) {
      e.stopPropagation();

      document.removeEventListener(moveEvent, onMove);
      document.removeEventListener(upEvent, onUp);

      el.dispatchEvent(new CustomEvent('dragend'));
    }
  };
};

const getOnMove = (el: HTMLElement) => {
  const track = el.parentElement;

  return function (e: MouseEvent | TouchEvent) {
    const { left, width } = track.getBoundingClientRect();
    const clickOffset = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clickPos = Math.min(Math.max((clickOffset - left) / width, 0), 1) || 0;
    el.dispatchEvent(new CustomEvent('drag', { detail: clickPos }));
  };
};
