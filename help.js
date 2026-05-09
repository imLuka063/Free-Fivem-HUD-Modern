/* =====================================================
   LAST STAND — Help Notification
   ===================================================== */
LS.Help = (() => {
  function show({ key = 'E', text = 'Interact' } = {}) {
    const root = LS.$('#help');
    LS.$('#help-key').textContent = key;
    LS.$('#help-text').textContent = text;
    root.classList.remove('hidden');
    root.style.animation = 'none'; void root.offsetWidth; root.style.animation = '';
  }
  function hide() {
    const root = LS.$('#help');
    if (root) root.classList.add('hidden');
  }
  return { show, hide };
})();
