// Lightweight pageview tracker — fires on every page load
// Sends: path, referrer, timestamp, session fingerprint (no PII)
// Client-side bot filtering: skip if no real user interaction capability
(function() {
  if (localStorage.getItem('ss_owner')) return;
  // Skip headless/automated browsers
  if (navigator.webdriver) return;
  // Skip if no screen dimensions (headless environments)
  if (!window.screen || window.screen.width === 0) return;
  var data = {
    p: location.pathname,
    r: document.referrer || '(direct)',
    t: Date.now(),
    s: sessionStorage.getItem('ss_sid') || (sessionStorage.ss_sid = Math.random().toString(36).slice(2))
  };
  navigator.sendBeacon('/api/track', JSON.stringify(data));
})();
