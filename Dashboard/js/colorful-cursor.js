(function(){
  // Skip on touch devices to avoid interference
  if ('ontouchstart' in window) return;
  const cursor = document.createElement('div');
  cursor.setAttribute('aria-hidden','true');
  Object.assign(cursor.style, {
    position: 'fixed',
    top: '0px',
    left: '0px',
    width: '16px',
    height: '16px',
    marginLeft: '-8px',
    marginTop: '-8px',
    borderRadius: '50%',
    pointerEvents: 'none',
    zIndex: 9999,
    background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(255,255,255,0.6) 25%, rgba(255,255,255,0.0) 55%), conic-gradient(from 0deg, #ff6b6b, #feca57, #1dd1a1, #54a0ff, #5f27cd, #ff6b6b)',
    boxShadow: '0 0 12px rgba(84,160,255,.35)',
    transform: 'translate3d(0,0,0) scale(1)',
    transition: 'transform .15s ease-out, opacity .25s ease-out',
    opacity: '0.85'
  });
  document.body.appendChild(cursor);

  let x = window.innerWidth / 2, y = window.innerHeight / 2;
  let tx = x, ty = y;

  function onMove(e){ tx = e.clientX; ty = e.clientY; }
  window.addEventListener('mousemove', onMove, {passive:true});

  // Subtle smoothing for elegance
  function tick(){
    x += (tx - x) * 0.2; // ease factor
    y += (ty - y) * 0.2;
    cursor.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1)`;
    requestAnimationFrame(tick);
  }
  tick();

  // Click pulse effect
  window.addEventListener('mousedown', ()=>{
    cursor.style.transform = `translate3d(${x}px, ${y}px, 0) scale(.8)`;
  }, {passive:true});
  window.addEventListener('mouseup', ()=>{
    cursor.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1)`;
  }, {passive:true});

  // Hide when leaving window
  window.addEventListener('mouseleave', ()=>{ cursor.style.opacity = '0'; });
  window.addEventListener('mouseenter', ()=>{ cursor.style.opacity = '0.85'; });

  // Respect reduced motion
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mq.matches) cursor.style.transition = 'opacity .25s ease-out';
})();
