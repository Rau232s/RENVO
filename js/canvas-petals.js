(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = matchMedia('(max-width: 768px)').matches;
  const canvas = document.getElementById('petalCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, petals = [];
  let isVisible = true;

  // Reducción drástica de cantidad de elementos en celular para evitar lag
  const COUNT = isMobile ? 30 : 70;
  // Limitador de PixelRatio para no sobrecargar el rendimiento en pantallas móviles de alta densidad
  const maxPixelRatio = isMobile ? 1.25 : 2;

  function resize() {
    const pr = Math.min(devicePixelRatio || 1, maxPixelRatio);
    W = canvas.width = innerWidth * pr;
    H = canvas.height = innerHeight * pr;
  }

  resize();
  addEventListener('resize', resize);

  for (let i = 0; i < COUNT; i++) {
    petals.push({
      x: Math.random(),
      y: Math.random(),
      r: (isMobile ? 4 : 6) + Math.random() * (isMobile ? 8 : 14),
      sp: 0.2 + Math.random() * 0.8,
      drift: Math.random() * Math.PI * 2,
      a: 0.3 + Math.random() * 0.5
    });
  }

  window.petalDensity = 0;
  window.windAmt = 0;

  function drawPetals(t) {
    if (!isVisible) return; // Si no está visible en pantalla, detenemos el renderizado para ahorrar batería

    ctx.clearRect(0, 0, W, H);
    const pr = Math.min(devicePixelRatio || 1, maxPixelRatio);

    for (const p of petals) {
      const px = (p.x + Math.sin(t * 0.0003 * p.sp + p.drift) * 0.04 * (0.5 + window.windAmt * 2)) * W;
      const py = (((p.y + t * 0.00004 * p.sp) % 1)) * H;
      const size = p.r * pr * (0.7 + window.petalDensity * 0.8);

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

  // Optimización con IntersectionObserver para pausar cuando el canvas no está en el viewport
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
        if (isVisible && !reduce) {
          requestAnimationFrame(drawPetals);
        }
      });
    }, { threshold: 0.05 });
    observer.observe(canvas);
  }

  if (!reduce) {
    requestAnimationFrame(drawPetals);
  }
})();