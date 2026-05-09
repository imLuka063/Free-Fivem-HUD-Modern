/* =====================================================
   LAST STAND — Bootstrap
   ===================================================== */
(function init() {
  LS.Editor.init();
  LS.Events.init();

  // Sensible defaults so the HUD looks alive on first paint
  LS.Money.set({ cash: 0, bank: 0, black: 0 });
  LS.ID.set('—');
  LS.Status.setHunger(100);
  LS.Status.setThirst(100);
  LS.Voice.set({ label: 'Normal', tier: 2, total: 5 });
  LS.Job.set({ name: 'Unemployed', grade: '' });
  LS.Location.set({ street: 'Vinewood Blvd', area: 'Vinewood', bearing: 'NE' });
  LS.Clock.startSystem();

  /* ----------- Browser Preview helpers (no NUI) ----------- */
  if (!LS.isNUI()) {
    // Press H to open editor in browser preview
    document.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'h' && !e.repeat) LS.Editor.toggle();
    });

    // Demo data so the HUD doesn't look empty in browser
    setTimeout(() => {
      LS.Money.set({ cash: 1450, bank: 28230, black: 750 });
      LS.ID.set(42);
      LS.Job.set({ name: 'Police', grade: 3 });
      LS.Help.show({ key: 'E', text: 'Open Inventory' });
      LS.Announcement.show({
        title: 'Server Restart',
        message: 'Restart in 10 minutes — finish your activities.',
        icon: '!',
        duration: 7000,
      });
    }, 600);

    setTimeout(() => LS.Notifications.show({ type: 'success', title: 'Connected', message: 'Welcome to Last Stand.' }), 1200);
    setTimeout(() => LS.Notifications.show({ type: 'info',    title: 'Tip',       message: 'Press H to open the HUD editor.' }), 2000);
    setTimeout(() => LS.Notifications.show({ type: 'error',   title: 'Wanted',    message: 'You are now wanted by the police.' }), 2800);
    setTimeout(() => LS.Notifications.show({ type: 'teamchat',title: 'Team',      message: 'Suspect spotted on Vinewood Blvd.' }), 3600);
    setTimeout(() => LS.Notifications.show({ color: '#ff7a00',title: 'Custom',    message: 'Hex color works too.' }), 4400);

    // Demo progress
    setTimeout(() => LS.Progress.start({ label: 'Lockpicking', duration: 5000 }), 2200);

    // Drain status slowly for a living feel
    let h = 100, t = 100;
    setInterval(() => {
      h = Math.max(0, h - 1); t = Math.max(0, t - 1.5);
      LS.Status.setHunger(h); LS.Status.setThirst(t);
      if (h === 0) h = 100; if (t === 0) t = 100;
    }, 4000);
  }
})();
