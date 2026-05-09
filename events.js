/* =====================================================
   LAST STAND — Backend Event Bridge
   ---------------------------------------------------------------
   Listens for messages from the FiveM client (Lua/JS). Use:
     SendNUIMessage({ action = 'notify', type = 'success', message = 'OK' })
   Every payload's `action` field selects a handler below.
   ===================================================== */
LS.Events = (() => {
  const handlers = {
    /* ---------- Announcement ---------- */
    showAnnouncement: (d) => LS.Announcement.show(d),
    hideAnnouncement: ()  => LS.Announcement.hide(),

    /* ---------- Help ---------- */
    showHelp: (d) => LS.Help.show(d),
    hideHelp: ()  => LS.Help.hide(),

    /* ---------- Notifications ---------- */
    notify: (d) => LS.Notifications.show(d),
    clearNotifications: () => LS.Notifications.clear(),

    /* ---------- Progress ---------- */
    progressStart:  (d) => LS.Progress.start(d),
    progressUpdate: (d) => LS.Progress.update(d.percent),
    progressCancel: ()  => LS.Progress.cancel(),
    progressFinish: ()  => LS.Progress.finish(false),

    /* ---------- Money ---------- */
    setMoney: (d) => LS.Money.set(d),
    setCash: (d) => LS.Money.setCash(d.value),
    setBank: (d) => LS.Money.setBank(d.value),
    setBlack: (d) => LS.Money.setBlack(d.value),

    /* ---------- ID ---------- */
    setId: (d) => LS.ID.set(d.id),

    /* ---------- Hunger / Thirst ---------- */
    setHunger: (d) => LS.Status.setHunger(d.value),
    setThirst: (d) => LS.Status.setThirst(d.value),
    setStatus: (d) => {
      if (d.hunger !== undefined) LS.Status.setHunger(d.hunger);
      if (d.thirst !== undefined) LS.Status.setThirst(d.thirst);
    },

    /* ---------- Voice ---------- */
    setVoice: (d) => LS.Voice.set(d),

    /* ---------- Job ---------- */
    setJob: (d) => LS.Job.set(d),

    /* ---------- Time / Date ---------- */
    setTime: (d) => LS.Clock.set(d),

    /* ---------- Location ---------- */
    setLocation: (d) => LS.Location.set(d),

    /* ---------- HUD Editor ---------- */
    openEditor:  () => LS.Editor.open(),
    closeEditor: () => LS.Editor.close(),
    toggleEditor:() => LS.Editor.toggle(),

    /* ---------- Bulk element toggle ---------- */
    toggleElement: (d) => {
      const el = document.getElementById(d.id);
      if (!el) return;
      el.dataset.disabled = String(!d.enabled);
      const input = LS.$(`#element-toggles input[data-toggle="${d.id}"]`);
      if (input) input.checked = !!d.enabled;
    },

    /* ---------- Master toggles ---------- */
    setMaster: (d) => {
      document.body.parentElement.classList.toggle('off', !d.enabled);
      LS.$('#toggle-master').checked = !!d.enabled;
    },
    setKino: (d) => {
      document.querySelector('.hud-root').classList.toggle('kino', !!d.enabled);
      LS.$('#toggle-kino').checked = !!d.enabled;
    },

    /* ---------- Layout ---------- */
    loadLayout: (d) => LS.Editor.loadLayout(d.layout),
  };

  function init() {
    window.addEventListener('message', (e) => {
      const data = e.data || {};
      const action = data.action || data.type;
      if (!action) return;
      const fn = handlers[action];
      if (typeof fn === 'function') fn(data);
    });
  }

  return { init, handlers };
})();
