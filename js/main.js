/* ===================================================
   MAIN.JS — Site entry, scroll reveal, cursor sparkles
   This file should be loaded LAST (after all other JS)
   =================================================== */

// ===== ENTER SITE =====
function enterSite() {
  document.getElementById('intro-screen').classList.add('hidden');
  document.getElementById('music-btn').style.opacity = '1';

  // Start particles
  initParticles();

  // Auto-play music
  musicPlaying = true;
  document.getElementById('music-btn').classList.add('playing');
  createBirthdayMusic();
}

// ===== SCROLL REVEAL =====
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.section').forEach(section => {
  observer.observe(section);
});

// ===== CURSOR SPARKLES =====
let lastSparkle = 0;

document.addEventListener('mousemove', e => {
  const now = Date.now();
  if (now - lastSparkle < 60) return;
  lastSparkle = now;

  const sparkle = document.createElement('div');
  sparkle.className = 'cursor-sparkle';
  sparkle.style.left = (e.clientX - 4) + 'px';
  sparkle.style.top = (e.clientY - 4) + 'px';
  document.body.appendChild(sparkle);

  setTimeout(() => sparkle.remove(), 600);
});

// ===== OPEN GIFT =====
let giftOpened = false;

function openGift() {
  const giftBox = document.getElementById('gift-box');

  if (!giftOpened) {
    giftOpened = true;
    giftBox.classList.add('opened');
    burstConfetti();

    setTimeout(() => {
      window.open('videos/birthday-video.mp4', '_blank');
    }, 800);
  } else {
    window.open('videos/birthday-video.mp4', '_blank');
  }
}
