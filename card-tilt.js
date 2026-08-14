(function () {
  const isMobile = matchMedia('(max-width: 768px)').matches;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Si es celular o el usuario prefiere reducir movimiento, no ejecutamos efectos 3D pesados
  if (isMobile || reduced) return;

  const cards = document.querySelectorAll('.fade-card');
  cards.forEach(card => {
    card.style.transformStyle = 'preserve-3d';
    const img = card.querySelector('.rounded-xl');
    const content = card.querySelector('.flex-grow');

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      card.style.transition = 'transform 0.1s ease-out';
      card.style.zIndex = '10';

      if (img) {
        img.style.transform = 'translateZ(30px)';
        img.style.transition = 'transform 0.1s ease-out';
      }
      if (content) {
        content.style.transform = 'translateZ(20px)';
        content.style.transition = 'transform 0.1s ease-out';
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      card.style.transition = 'transform 0.5s ease-out';
      card.style.zIndex = '1';

      if (img) {
        img.style.transform = 'translateZ(0px)';
        img.style.transition = 'transform 0.5s ease-out';
      }
      if (content) {
        content.style.transform = 'translateZ(0px)';
        content.style.transition = 'transform 0.5s ease-out';
      }
    });
  });
})();