(function () {
  function init() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    /* Line reveals generales */
    document.querySelectorAll('.reveal-line').forEach(line => {
      const inner = line.firstElementChild;
      if (!inner) return;
      gsap.set(inner, { yPercent: 120 });
      gsap.to(inner, {
        yPercent: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: line,
          start: 'top 85%'
        }
      });
    });

    /* Collection Cards Entrance */
    var cards = gsap.utils.toArray('#collection .fade-card');
    if (cards.length) {
      gsap.fromTo(cards, 
        { x: function(i) { return [-260, 0, 240][i] || 0; }, y: function(i) { return [-80, 120, -80][i] || 0; }, rotate: function(i) { return [-14, 0, 14][i] || 0; }, scale: 0.86, autoAlpha: 0.4 },
        { x: 0, y: 0, rotate: 0, scale: 1, autoAlpha: 1, stagger: 0.05, ease: 'none', scrollTrigger: { trigger: '#collection', start: 'top 80%', end: 'top 20%', scrub: 1 } }
      );
    }

    gsap.fromTo('#collection [data-scroll-word]', { y: '6vh', scale: 1.04 }, { y: '-4vh', scale: 0.99, ease: 'none', scrollTrigger: { trigger: '#collection', start: 'top bottom', end: 'bottom top', scrub: 1 } });

    /* Parallax background layers on scroll */
    gsap.to('#bgLayer', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: '#cinematic', start: 'top top', end: 'bottom top', scrub: 1 } });

    /* Integration cards staggered reveal */
    gsap.utils.toArray('#integration .fade-card').forEach(function(c) {
      gsap.fromTo(c, { y: 60, rotateX: 12, autoAlpha: 0, transformPerspective: 900 }, { y: 0, rotateX: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: c, start: 'top 88%' } });
    });

    /* Craft strip background & text parallax */
    gsap.to('#craftBg', { yPercent: 20, ease: 'none', scrollTrigger: { trigger: '#craft', start: 'top bottom', end: 'bottom top', scrub: 1 } });
    gsap.to('#craft .reveal-line', { yPercent: -15, ease: 'none', scrollTrigger: { trigger: '#craft', start: 'top bottom', end: 'bottom top', scrub: 1 } });

    /* Manifesto words progressive reveal */
    var words = gsap.utils.toArray('#noema-manifesto span[style*="font-weight:800"]');
    if (words.length) {
      gsap.fromTo(words, { autoAlpha: 0.12, y: '0.4em' }, { autoAlpha: 1, y: '0em', ease: 'none', stagger: 0.4, scrollTrigger: { trigger: '#noema-manifesto', start: 'top 70%', end: 'center center', scrub: 1 } });
    }

    /* Board giant word parallax */
    gsap.to('#noema-board h2', { yPercent: -14, ease: 'none', scrollTrigger: { trigger: '#noema-board', start: 'top bottom', end: 'bottom top', scrub: 1 } });
    gsap.utils.toArray('#noema-board article').forEach(function(a, i) {
      gsap.fromTo(a, { y: 70, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out', delay: i * 0.08, scrollTrigger: { trigger: '#noema-board', start: 'top 75%' } });
    });

    /* Support giant word parallax + cards */
    gsap.to('#noema-support h2', { yPercent: -12, ease: 'none', scrollTrigger: { trigger: '#noema-support', start: 'top bottom', end: 'bottom top', scrub: 1 } });
    gsap.utils.toArray('#noema-support article').forEach(function(a, i) {
      gsap.fromTo(a, { y: 90, rotateX: 8, autoAlpha: 0, transformPerspective: 900 }, { y: 0, rotateX: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out', delay: i * 0.1, scrollTrigger: { trigger: '#noema-support', start: 'top 72%' } });
    });

    /* Footer fade-up */
    gsap.fromTo('footer > div', { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: 'footer', start: 'top 90%' } });
    
    /* Dot row hover pulse */
    document.querySelectorAll('#dotRow span').forEach(function(d) {
      d.addEventListener('mouseenter', function() { gsap.to(d, { scale: 1.8, duration: 0.3, ease: 'back.out(2)' }); });
      d.addEventListener('mouseleave', function() { gsap.to(d, { scale: 1, duration: 0.3 }); });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

// GENERADOR DE INDICADORES (BEATS)
document.addEventListener('DOMContentLoaded', () => {
  const beats = document.querySelectorAll('.beat');
  const dotRow = document.getElementById('dotRow');

  if (dotRow && beats.length > 0) {
    dotRow.innerHTML = '';
    beats.forEach((_, index) => {
      const dot = document.createElement('span');
      dot.className = 'dot-indicator';
      dot.style.cssText = 'width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.3); cursor: pointer; transition: background 0.3s;';
      if (index === 0) dot.style.background = '#3B82F6';
      dotRow.appendChild(dot);
    });
  }
});

// TARJETAS DE MANTENIMIENTO E INTERSECCIÓN
document.addEventListener('DOMContentLoaded', () => {
  const observerOptions = {
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = entry.target.querySelectorAll('.fade-card, .reveal-line');
        cards.forEach((el, index) => {
          setTimeout(() => {
            el.classList.add('active');
          }, index * 100);
        });
      }
    });
  }, observerOptions);

  const section = document.getElementById('integration');
  if (section) {
    observer.observe(section);
  }
});

// MENU HAMBURGUESA MÓVIL
document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menu-btn');
  const navMenu = document.getElementById('nav-menu');
  const menuIcon = document.getElementById('menu-icon');

  if (menuBtn && navMenu) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('mobile-open');
      
      const isOpen = navMenu.classList.contains('mobile-open');
      if (isOpen) {
        menuIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
      } else {
        menuIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
      }
    });

    // Cierra el menú al hacer clic en cualquier enlace interno
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-open');
        menuIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
      });
    });
  }
});


document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.accordion-header').forEach(button => {
        button.addEventListener('click', () => {
            const item = button.parentElement;
            
            // Opcional: Si deseas que los demás elementos se cierren automáticamente al abrir uno nuevo, 
            // descomenta las siguientes 4 líneas:
            /*
            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                if (otherItem !== item) otherItem.classList.remove('active');
            });
            */

            item.classList.toggle('active');
        });
    });
});


