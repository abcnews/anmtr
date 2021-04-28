export const clickOutside = (node: Node) => {
  const handleClick = (event: MouseEvent | TouchEvent) => {
    if (node && event.target instanceof Node && !node.contains(event.target) && !event.defaultPrevented) {
      node.dispatchEvent(new CustomEvent('click_outside'));
    }
  };

  document.addEventListener('click', handleClick, true);

  return {
    destroy() {
      document.removeEventListener('click', handleClick, true);
    }
  };
};
