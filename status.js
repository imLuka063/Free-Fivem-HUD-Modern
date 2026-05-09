/* =====================================================
   LAST STAND — Status, Money, ID, Voice, Job, Clock, Location
   ===================================================== */

LS.Status = (() => {
  const TOTAL_DOTS = 10;
  
  function setBubbles(kind, v) {
    const container = LS.$(`#${kind}-bubbles`);
    if (!container) return;
    
    const value = LS.clamp(Number(v) || 0, 0, 100);
    const activeDots = Math.round((value / 100) * TOTAL_DOTS);
    
    const dots = container.querySelectorAll('.bubble-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx < activeDots);
    });
    
    container.parentElement.classList.toggle('low', value < 20);
  }
  
  return {
    setHunger: (v) => setBubbles('hunger', v),
    setThirst: (v) => setBubbles('thirst', v),
  };
})();

LS.Money = (() => {
  const elements = {
    cash:  { valueEl: '#money-cash-value', pillEl: '#money-cash' },
    bank:  { valueEl: '#money-bank-value', pillEl: '#money-bank' },
    black: { valueEl: '#money-black-value', pillEl: '#money-black' }
  };
  const last = { cash: 0, bank: 0, black: 0 };

  function set({ cash, bank, black } = {}) {
    if (cash  !== undefined) setCash(cash);
    if (bank  !== undefined) setBank(bank);
    if (black !== undefined) setBlack(black);
  }

  function setCash(value) {
    update('cash', value);
  }

  function setBank(value) {
    update('bank', value);
  }

  function setBlack(value) {
    update('black', value);
  }

  function update(type, value) {
    const el = LS.$(elements[type].valueEl);
    if (!el) return;
    const target = Number(value) || 0;
    countUp(el, last[type], target);
    last[type] = target;
    el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
  }

  function countUp(el, from, to) {
    const dur = 600;
    const start = performance.now();
    const diff = to - from;
    function tick(now) {
      const t = LS.clamp((now - start) / dur, 0, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = Math.round(from + diff * eased);
      el.textContent = LS.formatMoney(val);
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function getValue(type) {
    return last[type] || 0;
  }

  return { set, setCash, setBank, setBlack, update, getValue };
})();

LS.ID = {
  set(id) {
    const el = LS.$('#id-value');
    if (!el) return;
    el.textContent = String(id ?? '—');
  }
};

LS.Voice = (() => {
  const TIERS = ['Whisper', 'Normal', 'Shout'];
  const RANGE_M = [3, 8, 15, 25, 40];
  function set({ label, tier, total, meta } = {}) {
    const lblEl  = LS.$('#voice-label');
    const cnt    = LS.$('#voice-tiers');
    const metaEl = LS.$('#voice-meta');
    if (!cnt) return;
    const t = Number(tier) || 0;
    const n = Number(total) || (label ? TIERS.length : 3);
    if (lblEl) lblEl.textContent = label || TIERS[t] || `R${t + 1}`;
    if (metaEl) metaEl.textContent = meta || (RANGE_M[t] !== undefined ? RANGE_M[t] + 'M' : '—');
    cnt.innerHTML = '';
    for (let i = 0; i < n; i++) {
      const span = document.createElement('span');
      span.className = 'tier' + (i <= t ? ' active' : '');
      cnt.appendChild(span);
    }
  }
  return { set };
})();

LS.Job = {
  set({ name = 'Unemployed', grade = '' } = {}) {
    const nm = LS.$('#job-name');
    const gd = LS.$('#job-grade');
    if (nm) nm.textContent = name;
    if (gd) gd.textContent = grade !== '' && grade !== undefined ? grade : '—';
  }
};

LS.Clock = {
  set({ time, date } = {}) {
    if (time) LS.$('#clock-time').textContent = time;
    if (date) LS.$('#clock-date').textContent = date;
  },
  startSystem() {
    const fill = LS.$('#clock-sec-fill');
    const tick = () => {
      const d = new Date();
      const pad = n => String(n).padStart(2, '0');
      this.set({
        time: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
        date: `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`,
      });
      if (fill) fill.style.width = (d.getSeconds() / 59 * 100) + '%';
    };
    tick(); setInterval(tick, 1000);
  }
};

LS.Location = {
  BEARINGS: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'],
  set({ street = '', area = '', bearing } = {}) {
    if (street) LS.$('#location-street').textContent = street;
    LS.$('#location-area').textContent = area || '';
    if (bearing !== undefined) {
      const el = LS.$('#location-bearing');
      if (el) el.textContent = bearing;
    }
  }
};
