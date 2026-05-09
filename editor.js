/* =====================================================
   LAST STAND — HUD Editor (Drag, Toggle, Save) — Flagship
   ===================================================== */
LS.Editor = (() => {
  const STORAGE_KEY = 'ls_hud_layout_v1';
  const TOGGLES_KEY = 'ls_hud_toggles_v1';
  const STATE_KEY   = 'ls_hud_state_v1';
  const GRID_SIZE   = 20;

  const ELEMENTS = [
    { id: 'hud-header',    label: 'Server Logo' },
    { id: 'announcement',  label: 'Announcement' },
    { id: 'help',          label: 'Help / Hints' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'progress',      label: 'Progress Bar' },
    { id: 'money-cash',    label: 'Money (Cash)' },
    { id: 'money-bank',    label: 'Money (Bank)' },
    { id: 'money-black',   label: 'Money (Black)' },
    { id: 'player-id',     label: 'Player ID' },
    { id: 'status',        label: 'Hunger & Thirst' },
    { id: 'voice',         label: 'Voice Range' },
    { id: 'job',           label: 'Job' },
    { id: 'clock',         label: 'Time & Date' },
    { id: 'location',      label: 'Location' },
  ];

  let open = false;
  let snap = true;
  let drag = null;

  function init() {
    // FORCE CLEAR - Remove all old layout data to use new CSS positioning
    try { 
      // Clear main layout storage
      localStorage.removeItem(STORAGE_KEY);
      
      // Force clear any money element positions that might be stored
      const moneyIds = ['money-cash', 'money-bank', 'money-black'];
      moneyIds.forEach(id => {
        localStorage.removeItem(`ls_hud_pos_${id}`);
      });
      
      // Also try to parse and remove money entries from main storage
      const savedLayout = localStorage.getItem(STORAGE_KEY);
      if (savedLayout) {
        try {
          const layout = JSON.parse(savedLayout);
          moneyIds.forEach(id => delete layout[id]);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
        } catch(e) {}
      }
      
      console.log('[HUD] Cleared all localStorage layout data');
    } catch(e) {
      console.error('[HUD] Error clearing localStorage:', e);
    }
    
    buildToggleList();
    loadLayout();
    loadToggles();
    loadState();
    bindUI();
    
    // FORCE money elements to RIGHT side after everything loads
    setTimeout(() => {
      const moneyElements = [
        { id: 'money-cash', top: '105px' },
        { id: 'money-bank', top: '135px' },
        { id: 'money-black', top: '165px' }
      ];
      
      moneyElements.forEach(({ id, top }) => {
        const el = document.getElementById(id);
        if (el) {
          el.style.right = '18px';
          el.style.left = 'auto';
          el.style.top = top;
          el.style.bottom = 'auto';
          console.log(`[HUD] Forced ${id} to right: 18px, top: ${top}`);
        }
      });
    }, 50);
  }

  function bindUI() {
    LS.$('#editor-close').addEventListener('click', close);
    LS.$('#btn-save').addEventListener('click', save);
    LS.$('#btn-reset').addEventListener('click', reset);

    LS.$('#toggle-master').addEventListener('change', (e) => {
      document.body.parentElement.classList.toggle('off', !e.target.checked);
      persistState();
      LS.post('toggleMaster', { enabled: e.target.checked });
    });
    LS.$('#toggle-kino').addEventListener('change', (e) => {
      document.querySelector('.hud-root').classList.toggle('kino', e.target.checked);
      persistState();
      LS.post('toggleKino', { enabled: e.target.checked });
    });
    LS.$('#toggle-grid').addEventListener('change', (e) => {
      snap = e.target.checked;
      LS.$('#grid-overlay').classList.toggle('hidden', !(snap && open));
      persistState();
    });

    // Tabs
    LS.$$('.editor-tabs .tab').forEach(t => {
      t.addEventListener('click', () => {
        LS.$$('.editor-tabs .tab').forEach(x => x.classList.remove('active'));
        LS.$$('.tab-panel').forEach(x => x.classList.remove('active'));
        t.classList.add('active');
        LS.$(`.tab-panel[data-panel="${t.dataset.tab}"]`).classList.add('active');
      });
    });

    // Module search filter
    const search = LS.$('#module-search');
    if (search) {
      search.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase().trim();
        LS.$$('#element-toggles .switch-row').forEach(row => {
          const match = !q || row.dataset.label.toLowerCase().includes(q);
          row.dataset.hidden = String(!match);
        });
      });
    }

    // Quick actions
    LS.$$('.chip[data-quick]').forEach(b => {
      b.addEventListener('click', () => {
        switch (b.dataset.quick) {
          case 'notify':
            LS.Notifications.show({ type: 'success', title: 'Test', message: 'Notification system online.' });
            break;
          case 'announce':
            LS.Announcement.show({ title: 'Broadcast', message: 'This is a test announcement from the editor.', icon: '!', duration: 5000 });
            break;
          case 'help':
            LS.Help.show({ key: 'F', text: 'Test interaction prompt' });
            setTimeout(() => LS.Help.hide(), 4000);
            break;
          case 'progress':
            LS.Progress.start({ label: 'Loading...', duration: 5000 });
            break;
        }
      });
    });

    // ESC closes editor
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && open) close();
    });
  }

  function buildToggleList() {
    const host = LS.$('#element-toggles');
    host.innerHTML = '';
    ELEMENTS.forEach(({ id, label }) => {
      const row = document.createElement('label');
      row.className = 'switch-row';
      row.dataset.label = label;
      row.innerHTML = `
        <span>${label}</span>
        <input type="checkbox" data-toggle="${id}" checked />
        <span class="switch"></span>
      `;
      const input = row.querySelector('input');
      input.addEventListener('change', (e) => {
        const el = document.getElementById(id);
        if (el) el.dataset.disabled = String(!e.target.checked);
        persistToggles();
        LS.post('toggleElement', { id, enabled: e.target.checked });
      });
      // Hover-highlight the corresponding HUD element for clarity
      row.addEventListener('mouseenter', () => {
        const el = document.getElementById(id);
        if (el) el.style.outline = '1px dashed rgba(255,38,56,.65)', el.style.outlineOffset = '6px';
      });
      row.addEventListener('mouseleave', () => {
        const el = document.getElementById(id);
        if (el && !el.classList.contains('editing')) { el.style.outline = ''; el.style.outlineOffset = ''; }
      });
      host.appendChild(row);
    });
  }

  function openEditor() {
    open = true;
    LS.$('#editor').classList.remove('hidden');
    LS.$('#grid-overlay').classList.toggle('hidden', !snap);
    LS.$$('.hud-element').forEach(el => {
      if (el.id === 'editor' || el.id === 'grid-overlay') return;
      el.classList.add('draggable', 'editing');
      attachDrag(el);
      el.classList.remove('hidden');
    });
    LS.post('editorOpen');
  }

  function close() {
    open = false;
    LS.$('#editor').classList.add('hidden');
    LS.$('#grid-overlay').classList.add('hidden');
    LS.$$('.hud-element').forEach(el => {
      el.classList.remove('draggable', 'editing');
      detachDrag(el);
    });
    ['announcement','help','progress'].forEach(id => {
      const el = document.getElementById(id);
      if (el && !el.dataset.persistVisible) el.classList.add('hidden');
    });
    LS.post('editorClose');
  }

  function toggle() { open ? close() : openEditor(); }

  function attachDrag(el) {
    if (el._dragHandler) return;
    const onDown = (e) => {
      const ev = e.touches ? e.touches[0] : e;
      const rect = el.getBoundingClientRect();
      drag = { el, dx: ev.clientX - rect.left, dy: ev.clientY - rect.top };
      el.classList.add('dragging');
      
      // Preserve right alignment for money elements
      if (el.id === 'money-cash' || el.id === 'money-bank' || el.id === 'money-black') {
        // Keep right positioning, only update top
        el.style.top = rect.top + 'px';
      } else {
        el.style.left = rect.left + 'px';
        el.style.top  = rect.top + 'px';
        el.style.right = 'auto';
        el.style.bottom = 'auto';
      }
      e.preventDefault();
    };
    el._dragHandler = onDown;
    el.addEventListener('mousedown', onDown);
    el.addEventListener('touchstart', onDown, { passive: false });
  }

  function detachDrag(el) {
    if (!el._dragHandler) return;
    el.removeEventListener('mousedown', el._dragHandler);
    el.removeEventListener('touchstart', el._dragHandler);
    el._dragHandler = null;
  }

  function onMove(e) {
    if (!drag) return;
    const ev = e.touches ? e.touches[0] : e;
    let x = ev.clientX - drag.dx;
    let y = ev.clientY - drag.dy;
    if (snap) {
      x = Math.round(x / GRID_SIZE) * GRID_SIZE;
      y = Math.round(y / GRID_SIZE) * GRID_SIZE;
    }
    x = LS.clamp(x, 0, window.innerWidth  - drag.el.offsetWidth);
    y = LS.clamp(y, 0, window.innerHeight - drag.el.offsetHeight);
    
    // Preserve right alignment for money elements
    if (drag.el.id === 'money-cash' || drag.el.id === 'money-bank' || drag.el.id === 'money-black') {
      // Only update top position, keep right alignment
      drag.el.style.top = y + 'px';
    } else {
      drag.el.style.left = x + 'px';
      drag.el.style.top  = y + 'px';
    }
  }
  function onUp() {
    if (!drag) return;
    drag.el.classList.remove('dragging');
    drag = null;
  }
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup',   onUp);
  document.addEventListener('touchmove', onMove, { passive: true });
  document.addEventListener('touchend',  onUp);

  /* ---------- Persistence ---------- */
  function save() {
    const layout = {};
    LS.$$('.hud-element').forEach(el => {
      if (!el.id || el.id === 'editor' || el.id === 'grid-overlay') return;
      if (!el.style.left && !el.style.top && !el.style.right) return;
      
      // For money elements, save right position instead of left
      if (el.id === 'money-cash' || el.id === 'money-bank' || el.id === 'money-black') {
        layout[el.id] = { right: el.style.right || '18px', top: el.style.top };
      } else {
        layout[el.id] = { left: el.style.left, top: el.style.top };
      }
    });
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(layout)); } catch {}
    LS.post('saveLayout', { layout });
    LS.Notifications.show({ type: 'success', title: 'HUD', message: 'Layout saved successfully.' });
    close();
  }

  function loadLayout(layout) {
    let data = layout;
    if (!data) {
      try { data = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch {}
    }
    if (!data) return;
    
    // FORCE money elements to RIGHT side - always override any saved position
    const moneyElements = [
      { id: 'money-cash', top: '105px' },
      { id: 'money-bank', top: '135px' },
      { id: 'money-black', top: '165px' }
    ];
    
    moneyElements.forEach(({ id, top }) => {
      const el = document.getElementById(id);
      if (el) {
        el.style.right = '18px';
        el.style.left = 'auto';
        el.style.top = top;
        el.style.bottom = 'auto';
      }
    });
    
    Object.entries(data).forEach(([id, pos]) => {
      // Skip money elements - they are forced to right side above
      if (id === 'money-cash' || id === 'money-bank' || id === 'money-black') {
        return;
      }
      
      const el = document.getElementById(id);
      if (!el || !pos) return;
      // Only apply saved position if it has actual values
      if (pos.left && pos.left !== 'auto' && pos.left !== '') {
        el.style.left = pos.left;
        el.style.right = 'auto';
      } else if (pos.right && pos.right !== 'auto' && pos.right !== '') {
        el.style.right = pos.right;
        el.style.left = 'auto';
      }
      if (pos.top && pos.top !== 'auto' && pos.top !== '') {
        el.style.top = pos.top;
        el.style.bottom = 'auto';
      } else if (pos.bottom && pos.bottom !== 'auto' && pos.bottom !== '') {
        el.style.bottom = pos.bottom;
        el.style.top = 'auto';
      }
      el.style.transform = 'none';
    });
  }

  function reset() {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    LS.$$('.hud-element').forEach(el => {
      el.style.left = ''; el.style.top = '';
      el.style.right = ''; el.style.bottom = '';
      el.style.transform = '';
    });
    LS.post('resetLayout');
    LS.Notifications.show({ type: 'info', title: 'HUD', message: 'Layout reset to defaults.' });
  }

  function persistToggles() {
    const map = {};
    LS.$$('#element-toggles input').forEach(i => map[i.dataset.toggle] = i.checked);
    try { localStorage.setItem(TOGGLES_KEY, JSON.stringify(map)); } catch {}
  }
  function loadToggles() {
    let map = {};
    try { map = JSON.parse(localStorage.getItem(TOGGLES_KEY) || '{}'); } catch {}
    Object.entries(map).forEach(([id, enabled]) => {
      const input = LS.$(`#element-toggles input[data-toggle="${id}"]`);
      const el = document.getElementById(id);
      if (input) input.checked = enabled;
      if (el) el.dataset.disabled = String(!enabled);
    });
  }
  function persistState() {
    const s = {
      master: LS.$('#toggle-master').checked,
      kino:   LS.$('#toggle-kino').checked,
      grid:   LS.$('#toggle-grid').checked,
    };
    try { localStorage.setItem(STATE_KEY, JSON.stringify(s)); } catch {}
  }
  function loadState() {
    let s = {};
    try { s = JSON.parse(localStorage.getItem(STATE_KEY) || '{}'); } catch {}
    if (typeof s.master === 'boolean') {
      LS.$('#toggle-master').checked = s.master;
      document.body.parentElement.classList.toggle('off', !s.master);
    }
    if (typeof s.kino === 'boolean') {
      LS.$('#toggle-kino').checked = s.kino;
      document.querySelector('.hud-root').classList.toggle('kino', s.kino);
    }
    if (typeof s.grid === 'boolean') {
      LS.$('#toggle-grid').checked = s.grid;
      snap = s.grid;
    }
  }

  return { init, open: openEditor, close, toggle, save, reset, loadLayout };
})();
