function detectMob() {
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];
    
    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
}

if (detectMob()) {
  document.getElementById('caption').style = "bottom: 5px; right: 15px; color: white;";
  document.getElementById('vrv').style = "width: 100%; left: 0%; position:relative;";
}



const members = document.querySelectorAll(".member");
let current = 0;

document.getElementById("next").addEventListener("click", () => {
  members[current].classList.remove("active");
  current = (current + 1) % members.length;
  members[current].classList.add("active");
});

document.getElementById("prev").addEventListener("click", () => {
  members[current].classList.remove("active");
  current = (current - 1 + members.length) % members.length;
  members[current].classList.add("active");
});

/* ... */

(function () {
  const collapsibles = Array.from(document.querySelectorAll('.collapsible'));

  function setContentHeight(content) {
    content.style.maxHeight = 'none';
    const targetHeight = content.scrollHeight;
    requestAnimationFrame(() => {
      setTimeout(() => {
        content.style.maxHeight = targetHeight + 'px';
      }, 30);
    });
  }

  function collapseContent(content) {
    content.style.maxHeight = content.scrollHeight + 'px';
    requestAnimationFrame(() => {
      content.style.maxHeight = '0';
    });
  }

  function attachObservers(content) {
    if (window.ResizeObserver) {
      const ro = new ResizeObserver(() => {
        if (content.previousOpen) setContentHeight(content);
      });
      ro.observe(content);
      content.__ro = ro;
    } else {
      const mo = new MutationObserver(() => {
        if (content.previousOpen) setContentHeight(content);
      });
      mo.observe(content, { childList: true, subtree: true, characterData: true });
      content.__mo = mo;
    }
  }

  collapsibles.forEach(btn => {
    const content = btn.nextElementSibling;
    if (!content) return;
    content.style.overflow = 'hidden';
    content.style.maxHeight = '0';
    content.style.transition = content.style.transition || 'max-height 0.38s ease, padding 0.28s ease';
    content.previousOpen = false;
    attachObservers(content);

    btn.addEventListener('click', () => {
      const isActive = btn.classList.toggle('active');
      if (isActive) {
        content.previousOpen = true;
        btn.classList.add('opening');
        setContentHeight(content);
        setTimeout(() => btn.classList.remove('opening'), 450);
      } else {
        content.previousOpen = false;
        collapseContent(content);
      }
    });
  });

  let resizeTO;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTO);
    resizeTO = setTimeout(() => {
      collapsibles.forEach(btn => {
        const content = btn.nextElementSibling;
        if (!content) return;
        if (btn.classList.contains('active')) {
          setContentHeight(content);
        } else {
          content.style.maxHeight = '0';
        }
      });
    }, 120);
  });

  document.querySelectorAll('img').forEach(img => {
    if (!img.complete) {
      img.addEventListener('load', () => {
        collapsibles.forEach(btn => {
          const content = btn.nextElementSibling;
          if (btn.classList.contains('active')) setContentHeight(content);
        });
      }, { once: true });
    }
  });

  window.addEventListener('load', () => {
    collapsibles.forEach(btn => {
      const content = btn.nextElementSibling;
      if (btn.classList.contains('active')) setContentHeight(content);
    });
  });
})();

document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("bg-audio");
  let targetVolume = 0;
  let currentVolume = 0;
  const fadeSpeed = 0.02; // Adjust fade speed (lower = slower)

  // Start audio muted and paused until visible
  audio.volume = 0;
  audio.play().catch(() => {}); // autoplay attempt (muted context)

  // Use Intersection Observer to detect header visibility
  const header = document.getElementById("video-header");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      targetVolume = entry.isIntersecting ? 1 : 0; // fade in/out
    });
  }, { threshold: 0.3 }); // triggers when ~30% of header visible

  observer.observe(header);

  // Smooth fade effect loop
  function fadeAudio() {
    if (Math.abs(currentVolume - targetVolume) > 0.01) {
      currentVolume += (targetVolume - currentVolume) * fadeSpeed;
      audio.volume = currentVolume;
    } else {
      audio.volume = targetVolume;
    }
    requestAnimationFrame(fadeAudio);
  }
  fadeAudio();
});
