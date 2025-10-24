/* ---------- Utilities ---------- */
function qs(sel, ctx=document) { return ctx.querySelector(sel); }
function qsa(sel, ctx=document) { return Array.from(ctx.querySelectorAll(sel)); }

/* ---------- Smooth scrolling for nav links ---------- */
document.addEventListener('click', (ev) => {
  const a = ev.target.closest('[data-scroll], .nav-links a');
  if (!a) return;
  const link = a.closest('a') || a;
  const href = link.getAttribute('href') || link.dataset.href;
  if (!href || !href.startsWith('#')) return;
  ev.preventDefault();
  const el = document.querySelector(href);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

/* ---------- Video audio control & autoplay fallback ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const video = qs('#bg-video');
  const header = qs('#video-header');
  const unmuteBtn = qs('#unmute-btn');

  let targetVolume = 0;
  let currentVolume = 0;
  const fadeSpeed = 0.06;
  let userAllowedSound = false;

  function attemptPlayMuted() {
    video.muted = true;
    video.volume = 0;
    video.play().catch(()=>{});
  }
  attemptPlayMuted();

  function tryUnmuteAuto() {
    video.muted = false;
    return video.play()
      .then(() => {
        userAllowedSound = true;
        unmuteBtn.style.display = 'none';
      })
      .catch(() => {
        video.muted = true;
        unmuteBtn.style.display = 'inline-block';
      });
  }

  unmuteBtn.addEventListener('click', async () => {
    try {
      video.muted = false;
      await video.play();
      userAllowedSound = true;
      unmuteBtn.style.display = 'none';
    } catch (err) {
      console.warn('Could not unmute autoplay', err);
      video.muted = true;
    }
  });

  tryUnmuteAuto();

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && userAllowedSound) {
        targetVolume = 1;
      } else {
        targetVolume = 0;
      }
    });
  }, { threshold: 0.35 });
  io.observe(header);

  function onFirstInteraction() {
    if (!userAllowedSound) {
      tryUnmuteAuto();
    }
    window.removeEventListener('pointerdown', onFirstInteraction);
    window.removeEventListener('keydown', onFirstInteraction);
  }
  window.addEventListener('pointerdown', onFirstInteraction);
  window.addEventListener('keydown', onFirstInteraction);

  function fadeLoop() {
    if (video.muted) {
      if (currentVolume !== 0) {
        currentVolume = 0;
        video.volume = 0;
      }
    } else {
      if (Math.abs(currentVolume - targetVolume) > 0.005) {
        currentVolume += (targetVolume - currentVolume) * fadeSpeed;
        currentVolume = Math.max(0, Math.min(1, currentVolume));
        try { video.volume = currentVolume; } catch(e) {}
      } else {
        currentVolume = targetVolume;
        video.volume = currentVolume;
      }
    }
    requestAnimationFrame(fadeLoop);
  }
  fadeLoop();
});

/* ---------- VCR flicker on about images ---------- */
(function setupVcrFlicker() {
  const targets = qsa('.vcr-template img');
  function randomFlick() {
    if (!targets.length) return;
    const idx = Math.floor(Math.random() * targets.length);
    const el = targets[idx];
    el.classList.add('vcr-flicker');
    setTimeout(() => el.classList.remove('vcr-flicker'), 900);
    const next = 3000 + Math.floor(Math.random() * 6000);
    setTimeout(randomFlick, next);
  }
  setTimeout(randomFlick, 1800);
})();

/* ---------- Carousel: show 2 cards at a time, fade between pairs ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const grid = qs('.carousel-grid');
  const cards = qsa('.carousel-grid .card');
  const prevBtn = qs('#carousel-prev');
  const nextBtn = qs('#carousel-next');

  if (!grid || cards.length === 0) return;

  const pairs = [];
  for (let i = 0; i < cards.length; i += 2) {
    pairs.push([cards[i], cards[i+1] || null]);
  }

  let index = 0;
  let isTransitioning = false;

  function showPair(i) {
    i = (i + pairs.length) % pairs.length;
    grid.classList.add('carousel-fade-out');
    isTransitioning = true;
    setTimeout(() => {
      cards.forEach(c => { c.style.display = 'none'; c.style.opacity = '0'; });
      const pair = pairs[i];
      if (pair[0]) { pair[0].style.display = ''; pair[0].style.opacity = '1'; }
      if (pair[1]) { pair[1].style.display = ''; pair[1].style.opacity = '1'; }
      grid.classList.remove('carousel-fade-out');
      isTransitioning = false;
    }, 320);
  }

  cards.forEach(c => { c.style.display = 'none'; c.style.opacity = '0'; });
  showPair(index);

  nextBtn.addEventListener('click', () => {
    if (isTransitioning) return;
    index = (index + 1) % pairs.length;
    showPair(index);
  });

  prevBtn.addEventListener('click', () => {
    if (isTransitioning) return;
    index = (index - 1 + pairs.length) % pairs.length;
    showPair(index);
  });

  let autoplay = setInterval(() => { nextBtn.click(); }, 8000);
  grid.addEventListener('mouseenter', () => clearInterval(autoplay));
  grid.addEventListener('mouseleave', () => { autoplay = setInterval(() => nextBtn.click(), 8000); });
});








document.addEventListener('DOMContentLoaded', () => {
  const grid = qs('.scarousel-grid');
  const cards = qsa('.scarousel-grid .scard');
  const prevBtn = qs('#scarousel-prev');
  const nextBtn = qs('#scarousel-next');

  if (!grid || cards.length === 0) return;

  const pairs = [];
  for (let i = 0; i < cards.length; i += 2) {
    pairs.push([cards[i], cards[i+1] || null]);
  }

  let index = 0;
  let isTransitioning = false;

  function showPair(i) {
    i = (i + pairs.length) % pairs.length;
    grid.classList.add('scarousel-fade-out');
    isTransitioning = true;
    setTimeout(() => {
      cards.forEach(c => { c.style.display = 'none'; c.style.opacity = '0'; });
      const pair = pairs[i];
      if (pair[0]) { pair[0].style.display = ''; pair[0].style.opacity = '1'; }
      if (pair[1]) { pair[1].style.display = ''; pair[1].style.opacity = '1'; }
      grid.classList.remove('scarousel-fade-out');
      isTransitioning = false;
    }, 320);
  }

  cards.forEach(c => { c.style.display = 'none'; c.style.opacity = '0'; });
  showPair(index);

  nextBtn.addEventListener('click', () => {
    if (isTransitioning) return;
    index = (index + 1) % pairs.length;
    showPair(index);
  });

  prevBtn.addEventListener('click', () => {
    if (isTransitioning) return;
    index = (index - 1 + pairs.length) % pairs.length;
    showPair(index);
  });

  let autoplay = setInterval(() => { nextBtn.click(); }, 8000);
  grid.addEventListener('mouseenter', () => clearInterval(autoplay));
  grid.addEventListener('mouseleave', () => { autoplay = setInterval(() => nextBtn.click(), 8000); });
});

/* ---------- Collapsible FAQ logic ---------- */
(function () {
  const collapsibles = Array.from(document.querySelectorAll('.collapsible'));
  collapsibles.forEach(btn => {
    const content = btn.nextElementSibling;
    if (!content) return;
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      if (btn.classList.contains('active')) {
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        content.style.maxHeight = '0';
      }
    });
  });
})();
