document.addEventListener('DOMContentLoaded', () => {
  const observerOptions = { threshold: 0.15 };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      } else {
        entry.target.classList.remove('active');
      }
    });
  }, observerOptions);

  // Selecciona .zoom-reveal PERO ignora los que estén dentro de un carrusel
  document.querySelectorAll('.zoom-reveal:not(.carousel *)').forEach(el => observer.observe(el));
});