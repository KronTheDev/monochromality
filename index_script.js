/* ---------- Utilities ---------- */
function qs(sel, ctx=document) { return ctx.querySelector(sel); }
function qsa(sel, ctx=document) { return Array.from(ctx.querySelectorAll(sel)); }

/* ---------- Smooth scrolling for nav links ---------- */
document.addEventListener('click', (ev) => {
  const a = ev.target.closest('[data-scroll], .nav-links a');
  if (!a) return;
  // support both our data-scroll attr and normal nav links
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

  // initial state
  let targetVolume = 0;
  let currentVolume = 0;
  const fadeSpeed = 0.06; // interpolation speed
  let userAllowedSound = false;

  // Try to play the video (muted) so that we can later toggle volume
  function attemptPlayMuted() {
    video.muted = true;
    video.volume = 0;
    video.play().catch(()=> {
      // nothing to do — browser might still prevent autoplay of even muted video in odd cases
    });
  }
  attemptPlayMuted();

  // Try to unmute automatically (some browsers will block)
  function tryUnmuteAuto() {
    video.muted = false;
    return video.play()
      .then(() => {
        userAllowedSound = true;
        unmuteBtn.style.display = 'none';
      })
      .catch(() => {
        // blocked: revert to muted and show manual unmute button
        video.muted = true;
        unmuteBtn.style.display = 'inline-block';
      });
  }

  // When user explicitly clicks unmute, enable audio
  unmuteBtn.addEventListener('click', async () => {
    try {
      video.muted = false;
      await video.play();
      userAllowedSound = true;
      unmuteBtn.style.display = 'none';
    } catch (err) {
      // fallback: keep muted but still hide button (rare)
      console.warn('Could not unmute autoplay', err);
      video.muted = true;
    }
  });

  // Attempt a quick auto unmute (best-effort)
  tryUnmuteAuto();

  // IntersectionObserver: decide when header is visible
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // header visible enough
      if (entry.isIntersecting && userAllowedSound) {
        targetVolume = 1;
      } else {
        // If user hasn't allowed sound yet, remain 0.
        targetVolume = 0;
      }
    });
  }, { threshold: 0.35 });
  io.observe(header);

  // If user clicks anywhere on the page, treat it as interaction allowing autoplay policies.
  // We'll attempt to unmute on first meaningful interaction if still blocked.
  function onFirstInteraction() {
    if (!userAllowedSound) {
      tryUnmuteAuto(); // this will set userAllowedSound if allowed
    }
    window.removeEventListener('pointerdown', onFirstInteraction);
    window.removeEventListener('keydown', onFirstInteraction);
  }
  window.addEventListener('pointerdown', onFirstInteraction);
  window.addEventListener('keydown', onFirstInteraction);

  // Fade loop: smoothly interpolate video.volume -> targetVolume
  function fadeLoop() {
    // if the video is muted then currentVolume must remain 0
    if (video.muted) {
      if (currentVolume !== 0) {
        currentVolume = 0;
        video.volume = 0;
      }
    } else {
      // interpolate
      if (Math.abs(currentVolume - targetVolume) > 0.005) {
        currentVolume += (targetVolume - currentVolume) * fadeSpeed;
        // clamp
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

  // randomly add flicker classes to images every so often
  function randomFlick() {
    if (!targets.length) return;
    const idx = Math.floor(Math.random() * targets.length);
    const el = targets[idx];
    el.classList.add('vcr-flicker');
    // remove after animation completes
    setTimeout(() => el.classList.remove('vcr-flicker'), 900);
    // re-run at a random interval (between 3s and 9s)
    const next = 3000 + Math.floor(Math.random() * 6000);
    setTimeout(randomFlick, next);
  }

  // start after small delay so the page can settle
  setTimeout(randomFlick, 1800);
})();

/* ---------- Carousel: show 2 cards at a time, fade between pairs ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const grid = qs('.carousel-grid');
  const cards = qsa('.carousel-grid .card');
  const prevBtn = qs('#carousel-prev');
  const nextBtn = qs('#carousel-next');

  if (!grid || cards.length === 0) return;

  // make groups of 2 cards
  const pairs = [];
  for (let i = 0; i < cards.length; i += 2) {
    pairs.push([cards[i], cards[i+1] || null]);
  }

  let index = 0;
  let isTransitioning = false;

  function showPair(i) {
    // clamp
    i = (i + pairs.length) % pairs.length;
    // fade out grid for smoothness
    grid.classList.add('carousel-fade-out');
    isTransitioning = true;
    setTimeout(() => {
      // hide all cards
      cards.forEach(c => { c.style.display = 'none'; c.style.opacity = '0'; });
      // show the two cards for this pair
      const pair = pairs[i];
      if (pair[0]) { pair[0].style.display = ''; pair[0].style.opacity = '1'; }
      if (pair[1]) { pair[1].style.display = ''; pair[1].style.opacity = '1'; }
      // reveal container
      grid.classList.remove('carousel-fade-out');
      isTransitioning = false;
    }, 320); // duration shorter than fade animation to look snappy
  }

  // init: ensure all cards hidden, then show first pair
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

  // optional: autoplay rotate every 8s
  let autoplay = setInterval(() => { nextBtn.click(); }, 8000);
  // pause on hover
  grid.addEventListener('mouseenter', () => clearInterval(autoplay));
  grid.addEventListener('mouseleave', () => { autoplay = setInterval(() => nextBtn.click(), 8000); });
});

/* ---------- Collapsible FAQ logic (kept from prior code but simplified) ---------- */
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
