(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const beats = [
    { el: document.querySelector('[data-beat="0"]'), s: 0.00, e: 0.10 },
    { el: document.querySelector('[data-beat="1"]'), s: 0.11, e: 0.22 },
    { el: document.querySelector('[data-beat="2"]'), s: 0.23, e: 0.33 },
    { el: document.querySelector('[data-beat="3"]'), s: 0.34, e: 0.47 },
    { el: document.querySelector('[data-beat="4"]'), s: 0.48, e: 0.64 },
    { el: document.querySelector('[data-beat="5"]'), s: 0.65, e: 0.81 },
    { el: document.querySelector('[data-beat="6"]'), s: 0.82, e: 1.00 }
  ];

  function beatOpacity(p, s, e) {
    const span = (e - s);
    const fade = span * 0.30;
    if (p < s || p > e) return 0;
    if (p < s + fade) return (p - s) / fade;
    if (p > e - fade) return (e - p) / fade;
    return 1;
  }

  // Crear indicadores / puntos de línea de tiempo
  const dotRow = document.getElementById('dotRow');
  if (dotRow) {
    beats.forEach((b) => {
      const d = document.createElement('span');
      d.style.cssText = 'width:0.5rem;height:0.5rem;border-radius:50%;background:rgba(255,255,255,0.25);transition:background .3s,transform .3s;cursor:pointer;';
      d.addEventListener('click', () => {
        const sec = document.getElementById('cinematic');
        const top = sec.offsetTop + ((b.s + b.e) / 2) * (sec.offsetHeight - innerHeight);
        scrollTo({ top, behavior: 'smooth' });
      });
      dotRow.appendChild(d);
      b.dot = d;
    });
  }

  const section = document.getElementById('cinematic');
  const bgLayer = document.getElementById('bgLayer');
  const midLayer = document.getElementById('midLayer');
  const bouquet = document.getElementById('bouquet');
  const grade = document.getElementById('gradeWash');
  const lbTop = document.getElementById('lbTop');
  const lbBot = document.getElementById('lbBot');
  const tlFill = document.getElementById('timelineFill');
  const timeLabel = document.getElementById('timeLabel');
  const DUR = 12.75;

  let rawP = 0, renderP = 0;

  function raf() {
    renderP += (rawP - renderP) * 0.10;
    const p = renderP;

    const scale = 1 + p * 0.55 - Math.max(0, p - 0.48) * 0.35;
    const roll = p * 4 - Math.max(0, p - 0.65) * 3;
    const fwd = p * -40;

    if (bouquet) bouquet.style.transform = `scale(${scale}) rotate(${roll}deg) translateY(${fwd}px)`;
    if (bgLayer) bgLayer.style.transform = `scale(${1.1 + p * 0.15}) translateY(${p * -60}px)`;
    if (midLayer) midLayer.style.transform = `translateY(${p * 30}px)`;

    window.petalDensity = p < 0.48 ? p * 0.3 : Math.min(1, (p - 0.40) * 2.2);
    window.windAmt = Math.max(0, (p - 0.60)) * 1.4;

    if (grade) grade.style.opacity = 0.4 + Math.sin(p * Math.PI) * 0.5;

    let lb = 0;
    if (p < 0.06) lb = (p / 0.06) * 7;
    else if (p > 0.92) lb = 7 * (1 - (p - 0.92) / 0.08);
    else lb = 7;

    if (lbTop) lbTop.style.height = lb + 'vh';
    if (lbBot) lbBot.style.height = lb + 'vh';

    if (tlFill) tlFill.style.width = (p * 100) + '%';
    if (timeLabel) timeLabel.textContent = (p * DUR).toFixed(2) + 's';

    beats.forEach(b => {
      if (!b.el) return;
      const o = beatOpacity(p, b.s, b.e);
      b.el.style.opacity = o.toFixed(3);
      b.el.style.transform = `translateY(${(1 - o) * 18}px)`;
      const active = p >= b.s && p <= b.e;
      if (b.dot) {
        b.dot.style.background = active ? '#f5b8d0' : 'rgba(255,255,255,0.25)';
        b.dot.style.transform = active ? 'scale(1.4)' : 'scale(1)';
      }
    });

    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  function updateScroll() {
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const travel = section.offsetHeight - innerHeight;
    const scrolled = Math.min(Math.max(-rect.top, 0), travel);
    rawP = travel > 0 ? scrolled / travel : 0;
    if (reduce) renderP = rawP;
  }

  addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();
})();