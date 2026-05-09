/* =====================================================
   LAST STAND — Utilities
   ===================================================== */
window.LS = window.LS || {};

LS.$  = (sel, root = document) => root.querySelector(sel);
LS.$$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

LS.NAMED_COLORS = {
  success:  '#34c759',
  error:    '#ff3b30',
  info:     '#ffcc00',
  teamchat: '#5ac8fa',
  red:      '#ff3b30',
  green:    '#34c759',
  blue:     '#5ac8fa',
  yellow:   '#ffcc00',
  orange:   '#ff9e3d',
  purple:   '#bf5af2',
  white:    '#f5f5f7',
  black:    '#0a0a0c',
};

/** Resolve any color input (named, type, or #hex) to a CSS color. */
LS.resolveColor = (value) => {
  if (!value) return null;
  const v = String(value).trim().toLowerCase();
  if (LS.NAMED_COLORS[v]) return LS.NAMED_COLORS[v];
  if (/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(v)) return v;
  if (/^rgb/i.test(v) || /^hsl/i.test(v)) return v;
  return null;
};

LS.formatMoney = (n) => {
  const num = Number(n) || 0;
  return '$' + num.toLocaleString('en-US');
};

LS.clamp = (v, min, max) => Math.max(min, Math.min(max, v));

/** Send NUI callback to FiveM resource. Safely no-ops outside NUI. */
LS.post = async (name, data = {}) => {
  try {
    const resName = (window.GetParentResourceName && window.GetParentResourceName()) || 'last-stand-hud';
    return await fetch(`https://${resName}/${name}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      body: JSON.stringify(data),
    });
  } catch (e) {
    /* no-op in browser preview */
    return null;
  }
};

LS.isNUI = () => typeof window.GetParentResourceName === 'function';

/* Detect browser preview to enable nicer background */
if (!LS.isNUI()) document.body.classList.add('preview');
