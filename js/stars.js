// Star field background — shared across all pages
(function() {
  var canvas = document.createElement('canvas');
  canvas.id = 'stars';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'position:fixed;inset:0;z-index:0;pointer-events:none;';
  document.body.insertBefore(canvas, document.body.firstChild);

  var ctx = canvas.getContext('2d');
  var w, h, stars = [];
  var COUNT = 80;
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function init() {
    resize();
    stars = [];
    for (var i = 0; i < COUNT; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.2 + 0.3,
        base: Math.random() * 0.4 + 0.1,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.003 + 0.001
      });
    }
  }

  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var flicker = prefersReduced ? s.base : s.base + Math.sin(t * s.speed + s.phase) * 0.15;
      var alpha = Math.max(0.05, Math.min(0.55, flicker));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(201,173,111,' + alpha + ')';
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  init();
  window.addEventListener('resize', function() { resize(); init(); });
  requestAnimationFrame(draw);
})();
