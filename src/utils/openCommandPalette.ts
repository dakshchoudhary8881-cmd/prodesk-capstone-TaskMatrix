export const openCommandPalette = () => {
  const event = new CustomEvent('open-command-palette');
  window.dispatchEvent(event);
};
