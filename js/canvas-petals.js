(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = document.getElementById('petalCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, petals = [];

  function resize() {
    W = canvas.width = innerWidth * devicePixelRatio;
    H = canvas.height = innerHeight * devicePixelRatio;
  }

  resize();
  addEventListener('resize', resize);

  for (let i = 0; i < 70; i++) {
    petals.push({
      x: Math.random(),
      y: Math.random(),
      r: 6 + Math.random() * 14,
      sp: 0.2 + Math.random() * 0.8,
      drift: Math.random() * Math.PI * 2,
      a: 0.3 + Math.random() * 0.5
    });
  }

  window.petalDensity = 0;
  window.windAmt = 0;

  function drawPetals(t) {
    ctx.clearRect(0, 0, W, H);
    for (const p of petals) {
      const px = (p.x + Math.sin(t * 0.0003 * p.sp + p.drift) * 0.04 * (0.5 + window.windAmt * 2)) * W;
      const py = (((p.y + t * 0.00004 * p.sp) % 1)) * H;
      const size = p.r * devicePixelRatio * (0.7 + window.petalDensity * 0.8);

      ctx.globalAlpha = p.a * window.petalDensity;
      const g = ctx.createRadialGradient(px, py, 0, px, py, size);
      g.addColorStop(0, 'rgba(43, 130, 243, 0.9)');
      g.addColorStop(1, 'rgba(23, 80, 240, 0)');

      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(px, py, size, size * 0.6, p.drift + t * 0.0002, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(drawPetals);
  }

  if (!reduce) requestAnimationFrame(drawPetals);
})();