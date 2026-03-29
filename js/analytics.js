// Lightweight pageview tracker — fires on every page load
// Sends: path, referrer, timestamp, session fingerprint (no PII)
(function() {
  if (localStorage.getItem('ss_owner')) return;
  var data = {
    p: location.pathname,
    r: document.referrer || '(direct)',
    t: Date.now(),
    s: sessionStorage.getItem('ss_sid') || (sessionStorage.ss_sid = Math.random().toString(36).slice(2))
  };
  navigator.sendBeacon('/api/track', JSON.stringify(data));
})();
