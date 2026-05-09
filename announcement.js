/* =====================================================
   LAST STAND — Announcement
   ===================================================== */
LS.Announcement = (() => {
  let timer = null;
  let progressTimer = null;

  function show({ title = 'Announcement', message = '', icon = '!', duration = 6000 } = {}) {
    const root  = LS.$('#announcement');
    const tEl   = LS.$('#announcement-title');
    const mEl   = LS.$('#announcement-message');
    const iEl   = LS.$('#announcement-icon');
    const bar   = LS.$('#announcement-progress-bar');
    if (!root) return;

    tEl.textContent = title;
    mEl.textContent = message;
    iEl.textContent = icon;

    root.classList.remove('hidden', 'hide');
    // restart animation
    root.style.animation = 'none'; void root.offsetWidth; root.style.animation = '';

    clearTimeout(timer);
    cancelAnimationFrame(progressTimer);

    if (duration > 0 && bar) {
      bar.style.transition = 'none';
      bar.style.transform = 'scaleX(1)';
      requestAnimationFrame(() => {
        bar.style.transition = `transform ${duration}ms linear`;
        bar.style.transform = 'scaleX(0)';
      });
      timer = setTimeout(hide, duration);
    }
  }

  function hide() {
    const root = LS.$('#announcement');
    if (!root) return;
    root.classList.add('hide');
    setTimeout(() => root.classList.add('hidden'), 200);
  }

  return { show, hide };
})();
