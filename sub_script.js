document.addEventListener("DOMContentLoaded", () => {
  const ids = [
    "mainTitle", "adapriveUN", "adaptiveFN", "adaptiveLN", "adaptiveE", "adaptiveCO", "adaptiveSU"
  ];

  const delayBetween = 200; // ms between titles
  const typingSpeed = 60;   // ms per letter

  // Store original text first, before clearing
  const elements = ids.map(id => {
    const el = document.getElementById(id);
    if (!el) return null;
    const originalText = el.textContent.trim();
    el.textContent = ""; // clear text
    return { el, text: originalText };
  }).filter(Boolean); // remove nulls

  // Typing effect for one element
  function typeText(el, text, callback) {
    let i = 0;
    const interval = setInterval(() => {
      el.textContent += text[i];
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setTimeout(callback, delayBetween);
      }
    }, typingSpeed);
  }

  // Recursive sequence typing
  function startTypingSequence(index = 0) {
    if (index >= elements.length) return;
    const { el, text } = elements[index];
    typeText(el, text, () => startTypingSequence(index + 1));
  }

  startTypingSequence();
});