const cursor = document.querySelector('.custom-cursor');
const follower = document.querySelector('.cursor-follower');

let posX = 0, posY = 0;
let mouseX = 0, mouseY = 0;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  
  cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
});

function renderFollower() {
  posX += (mouseX - posX) * 0.15;
  posY += (mouseY - posY) * 0.15;
  
  follower.style.transform = `translate(${posX}px, ${posY}px)`;
  requestAnimationFrame(renderFollower);
}
renderFollower();

// Agranda cursor en enlaces/botones
document.querySelectorAll('a, button, input').forEach(el => {
  el.addEventListener('mouseenter', () => {
    follower.style.width = '50px';
    follower.style.height = '50px';
    follower.style.background = 'rgba(59, 130, 246, 0.2)';
  });
  el.addEventListener('mouseleave', () => {
    follower.style.width = '32px';
    follower.style.height = '32px';
    follower.style.background = 'transparent';
  });
});