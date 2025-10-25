// script.js - SPA slide navigation, device detection, CTAs and interactions
document.addEventListener('DOMContentLoaded', () => {
  const navBtns = Array.from(document.querySelectorAll('.nav-btn'));
  const screens = Array.from(document.querySelectorAll('.screen'));
  const yearEl = document.getElementById('year');
  const deviceType = document.getElementById('device-type');
  const mobileCTA = document.getElementById('mobileCTA');
  const desktopInfo = document.getElementById('desktopInfo');
  const sendLinkBtn = document.getElementById('sendLinkBtn');
  const openAppDemo = document.getElementById('openAppDemo');
  const appDemoModal = document.getElementById('appDemoModal');
  const modalCloses = Array.from(document.querySelectorAll('.modal-close'));
  const contactForm = document.getElementById('contactForm');

  // set year
  const yearSpan = document.getElementById('year');
  yearSpan && (yearSpan.textContent = new Date().getFullYear());

  // reveal observer
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('in-view');
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.fade, .glass, .card, .hero-visual, .hero-card').forEach(el => observer.observe(el));

  // device detection
  function isMobile() {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return window.innerWidth <= 768 || mobileRegex.test(ua);
  }

  function renderAppCTA() {
    const dt = isMobile() ? 'Móvil' : 'Escritorio';
    deviceType && (deviceType.textContent = `Dispositivo: ${dt}`);
    document.body.classList.toggle('is-mobile', isMobile());
    document.body.classList.toggle('is-desktop', !isMobile());
    if (mobileCTA) mobileCTA.classList.toggle('hidden', !isMobile());
    if (desktopInfo) desktopInfo.classList.toggle('hidden', isMobile());
  }
  renderAppCTA();
  window.addEventListener('resize', renderAppCTA);

  // mock send link
  function sendLinkPrompt() {
    const email = prompt('Introduce tu correo para enviarte el enlace de descarga:');
    if (email) alert(`En breve enviaremos el enlace a ${email}`);
  }
  sendLinkBtn && sendLinkBtn.addEventListener('click', sendLinkPrompt);
  document.getElementById('modalSendLink') && document.getElementById('modalSendLink').addEventListener('click', sendLinkPrompt);

  // redirige a página de la app
openAppDemo && openAppDemo.addEventListener('click', () => {
  window.location.href = "pagina del usuario"; // o el nombre que tenga tu página de la app
});


  // contact form
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      document.getElementById('contactMsg').textContent = '¡Mensaje enviado! Gracias, te contactaremos pronto.';
      contactForm.reset();
    });
  }

  // SPA slide navigation (directional)
  let current = document.querySelector('.screen.active');

  function goToScreen(targetId) {
    if (!targetId) return;
    const target = document.getElementById(targetId);
    if (!target || target === current) return;

    const idxCurrent = screens.indexOf(current);
    const idxTarget = screens.indexOf(target);
    const toLeft = idxTarget > idxCurrent;

    // prepare classes
    current.classList.remove('active');
    current.style.pointerEvents = 'none';
    target.style.pointerEvents = 'none';

    // animate out/in
    current.classList.add(toLeft ? 'enter-left' : 'enter-right');
    target.classList.add(toLeft ? 'enter-right' : 'enter-left');
    // force reflow
    void target.offsetWidth;

    // swap
    screens.forEach(s => {
      s.classList.remove('enter-left','enter-right','active');
    });
    target.classList.add('active');

    // update nav state
    navBtns.forEach(b => b.classList.toggle('active', b.dataset.target === targetId));
    current = target;
    target.style.pointerEvents = '';
    current.style.pointerEvents = '';
  }

  navBtns.forEach(btn => btn.addEventListener('click', () => {
    goToScreen(btn.dataset.target);
  }));

  // also hook elements that use data-target (CTAs)
  document.querySelectorAll('[data-target]').forEach(el => {
    el.addEventListener('click', (ev) => {
      ev.preventDefault();
      const t = el.dataset.target;
      goToScreen(t);
    });
  });

  // keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      const idx = screens.indexOf(current);
      if (e.key === 'ArrowRight' && idx < screens.length - 1) goToScreen(screens[idx + 1].id);
      if (e.key === 'ArrowLeft' && idx > 0) goToScreen(screens[idx - 1].id);
    }
    if (e.key === 'Escape') {
      appDemoModal.classList.add('hidden');
      appDemoModal.setAttribute('aria-hidden','true');
    }
  });

  // small typing effect for hero tagline
  const phrases = ['Less doubts, more style', 'Tu armario, mejor con YVC', 'Decide con seguridad'];
  let pi = 0, ti = 0;
  const tp = document.getElementById('typed-placeholder');
  function typeLoop(){
    if (!tp) return;
    const txt = phrases[pi];
    tp.textContent = txt.slice(0, ++ti);
    if (ti === txt.length){
      setTimeout(()=>{ ti = 0; pi = (pi+1) % phrases.length; setTimeout(typeLoop, 400); }, 1000);
    } else {
      setTimeout(typeLoop, 60);
    }
  }
  if (tp) typeLoop();

  // small: animate social hover pulse on load
  document.querySelectorAll('.social-floating .sf').forEach((el, i) => {
    el.style.animation = `socialEntrance 600ms ${i * 120}ms both cubic-bezier(.2,.9,.2,1)`;
  });

});
   // form 
   document.getElementById("contactForm").addEventListener("submit", function(e) {
  e.preventDefault();

  emailjs.sendForm(
    "service_v0k9vui",     
    "template_dxwh0de",    
    this
  ).then(function() {
    alert("✅ ¡Mensaje enviado con éxito!");
    document.getElementById("contactForm").reset();
  }, function(error) {
    alert("❌ Error al enviar el mensaje: " + JSON.stringify(error));
  });
});
