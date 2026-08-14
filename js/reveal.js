document.addEventListener('DOMContentLoaded', () => {
  const observerOptions = {
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Cuando el elemento entra en pantalla, se activa la animación
        entry.target.classList.add('active');
      } else {
        // Cuando el elemento SALE de la pantalla, se quita la clase 
        // para que pueda volver a animarse la próxima vez que subas/bajes
        entry.target.classList.remove('active');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.zoom-reveal').forEach(el => observer.observe(el));
});