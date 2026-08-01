function addStyles() {
  if (document.getElementById(ROOT_ID)) return;

  const style = document.createElement('style');
  style.id = ROOT_ID;
  style.textContent = BRYBRY_ENHANCER_CSS;
  document.head.append(style);
}
