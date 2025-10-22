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
const canvas = document.getElementById('trailCanvas');
const ctx = canvas.getContext('2d');
let width = window.innerWidth, height = window.innerHeight;
canvas.width = width; canvas.height = height;
const trail = []; let maxTrail = 50; let mouseX = 0, mouseY = 0, lastX = 0, lastY = 0, speed = 0;

window.addEventListener('resize', () => {width = window.innerWidth; height = window.innerHeight; canvas.width = width; canvas.height = height;});
document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    const dx = mouseX - lastX, dy = mouseY - lastY; speed = Math.sqrt(dx*dx + dy*dy);
    lastX = mouseX; lastY = mouseY;
    maxTrail = Math.min(45, 15 + speed * 0.7);
    const alphaDecay = 0.14 + speed / 600;
    for (let i = 0; i < 2; i++) trail.push({x: mouseX, y: mouseY, alpha: 1, decay: alphaDecay});
    if (trail.length > maxTrail) trail.splice(0, trail.length - maxTrail);
});

function animateTrail() {
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 35;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'square';
    for (let i = 0; i < trail.length - 1; i++) {
    const p1 = trail[i]; const p2 = trail[i + 1];
    ctx.strokeStyle = `rgba(100,100,255,${p1.alpha-.2})`;
    ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
    p1.alpha -= p1.decay;
    }
    requestAnimationFrame(animateTrail);
}

(function () {
  const widget = document.getElementById('trailWidget');
  const panel = document.getElementById('trailPanel');
  const tab = widget.querySelector('.trail-tab');
  const checkbox = document.getElementById('trailToggle');
  const canvas = document.getElementById('trailCanvas');

  const canvasExists = !!canvas;
  if (canvasExists) {
    checkbox.checked = (canvas.style.display !== 'none');
  } else {
    checkbox.checked = false;
    checkbox.disabled = true;
    widget.classList.add('open');
  }

  checkbox.addEventListener('change', () => {
    if (!canvas) return;
    if (checkbox.checked) {
      canvas.style.display = 'block';
      window.TRAIL_ENABLED = true;
    } else {
      canvas.style.display = 'none';
      window.TRAIL_ENABLED = false;
    }
  });

  tab.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = widget.classList.toggle('open');
    tab.setAttribute('aria-expanded', String(isOpen));
    panel.setAttribute('aria-hidden', String(!isOpen));
  });

  document.addEventListener('click', (e) => {
    if (!widget.contains(e.target)) {
      widget.classList.remove('open');
      tab.setAttribute('aria-expanded', 'false');
      panel.setAttribute('aria-hidden', 'true');
    }
  });

  tab.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      tab.click();
    } else if (e.key === 'Escape') {
      widget.classList.remove('open');
      tab.setAttribute('aria-expanded', 'false');
      panel.setAttribute('aria-hidden', 'true');
      tab.focus();
    }
  });

  window.toggleTrail = function (on) {
    if (!canvas) return;
    checkbox.checked = !!on;
    checkbox.dispatchEvent(new Event('change'));
  };
})();


if (!detectMob()) {
    animateTrail();
}
else {
    document.getElementById('caption').style = "bottom: 5px; right: 15px; color: white;";
    document.getElementById('vrv').style = "width: 100%; left: 0%; position:relative;";
    document.getElementById('trailWidget').style.display = "none";
}

const adaptiveYou = document.getElementById('adaptiveYou');
const fonts = ["Inter", "Playfair Display", "Orbitron", "Pacifico", "Courier Prime"];
let fontIndex = 0;

function typeEffect(text, font) {
  adaptiveYou.style.fontFamily = font;
  adaptiveYou.textContent = "";
  let i = 0;
  return new Promise(resolve => {
    const interval = setInterval(() => {
      adaptiveYou.textContent += text[i];
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        resolve();
      }
    }, 100);
  });
}

function eraseEffect() {
  return new Promise(resolve => {
    const interval = setInterval(() => {
      adaptiveYou.textContent = adaptiveYou.textContent.slice(0, -1);
      if (adaptiveYou.textContent.length === 0) {
        clearInterval(interval);
        resolve();
      }
    }, 60);
  });
}

async function loopTyping() {
  while (true) {
    const font = fonts[fontIndex];
    fontIndex = (fontIndex + 1) % fonts.length;
    await typeEffect("YOU", font);
    await new Promise(r => setTimeout(r, 1000));
    await eraseEffect();
    await new Promise(r => setTimeout(r, 200));
  }
}

if (adaptiveYou) {
  window.addEventListener("beforeunload", () => clearInterval());
  loopTyping();
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

