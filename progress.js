/* =====================================================
   LAST STAND — Progress Bar Module (SEGMENTED)
   ===================================================== */
LS.Progress = (() => {
  let timeout = null;
  let interval = null;
  const TOTAL_SEGMENTS = 10;

  /**
   * @param {Object} opts
   * @param {string} opts.label
   * @param {number} [opts.duration=5000] - ms
   */
  function start(opts = {}) {
    const root = LS.$('#progress');
    const label = LS.$('#progress-label');
    const segments = LS.$$('#progress-segments .segment');
    
    if (!root || segments.length === 0) return;

    // Clear any existing progress
    stop();

    const duration = Number(opts.duration) || 5000;
    
    // Set label
    if (label) label.textContent = opts.label || 'Loading...';
    
    // Reset all segments
    segments.forEach(seg => seg.classList.remove('active'));
    
    // Show
    root.classList.remove('hidden');

    // Animate segments
    const startTime = Date.now();
    const segmentDuration = duration / TOTAL_SEGMENTS;
    
    interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const activeSegments = Math.floor(elapsed / segmentDuration);
      
      segments.forEach((seg, idx) => {
        seg.classList.toggle('active', idx < activeSegments);
      });
      
      if (elapsed >= duration) {
        clearInterval(interval);
        interval = null;
      }
    }, 50);

    // Auto-stop after duration
    timeout = setTimeout(() => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
      stop();
    }, duration);
  }

  function stop() {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
    
    const root = LS.$('#progress');
    if (root) {
      root.classList.add('hidden');
      root.classList.remove('cancel');
    }
    
    // Reset segments
    const segments = LS.$$('#progress-segments .segment');
    segments.forEach(seg => seg.classList.remove('active'));
  }

  function update(percent) {
    const segments = LS.$$('#progress-segments .segment');
    if (segments.length === 0) return;
    
    const value = LS.clamp(percent, 0, 100);
    const activeSegments = Math.round((value / 100) * TOTAL_SEGMENTS);
    
    segments.forEach((seg, idx) => {
      seg.classList.toggle('active', idx < activeSegments);
    });
  }

  function cancel() {
    const root = LS.$('#progress');
    if (root) root.classList.add('cancel');
    
    stop();
    LS.post('progressCancel');
  }

  function finish() {
    stop();
  }

  return { start, stop, update, cancel, finish };
})();
