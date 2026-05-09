/* =====================================================
   LAST STAND — Notification System (SY_Notify Style)
   ===================================================== */
LS.Notifications = (() => {
  const stack = () => LS.$('#notifications');
  const ICONS = {
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    error:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    info:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
    warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    teamchat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>',
    announcement: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>',
  };

  /**
   * @param {Object} opts
   * @param {string} [opts.type='info']     - success | error | info | warning | teamchat | announcement | custom
   * @param {string} [opts.title]
   * @param {string} opts.message
   * @param {number} [opts.duration=4500]   - ms
   * @param {string} [opts.color]           - hex / rgb / named override
   * @param {string} [opts.icon]            - override icon SVG
   */
  function show(opts = {}) {
    const root = stack();
    if (!root) return;

    const type = (opts.type || 'info').toLowerCase();
    const accent = LS.resolveColor(opts.color) || LS.resolveColor(type) || '#c8102e';
    const icon = opts.icon || ICONS[type] || ICONS.info;

    const el = document.createElement('div');
    el.className = `notify-item ${['success','error','info','warning','teamchat','announcement'].includes(type) ? type : ''}`;
    el.style.setProperty('--accent', accent);
    el.innerHTML = `
      <div class="notify-icon">${icon}</div>
      <div class="notify-body">
        ${opts.title ? `<div class="notify-title">${escape(opts.title)}</div>` : ''}
        <div class="notify-message">${escape(opts.message || '')}</div>
      </div>
      <div class="notify-progress"></div>
    `;
    root.appendChild(el);

    const dur = Number(opts.duration) || 4500;
    
    // Animate progress bar
    const progress = el.querySelector('.notify-progress');
    if (progress) {
      progress.style.transition = `width ${dur}ms linear`;
      requestAnimationFrame(() => {
        progress.style.width = '0%';
      });
    }
    
    setTimeout(() => dismiss(el), dur);
  }

  function dismiss(el) {
    if (!el || !el.parentNode) return;
    el.classList.add('hide');
    setTimeout(() => el.remove(), 300);
  }

  function clear() {
    const root = stack();
    if (root) root.innerHTML = '';
  }

  function escape(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    })[c]);
  }

  return { show, dismiss, clear };
})();
