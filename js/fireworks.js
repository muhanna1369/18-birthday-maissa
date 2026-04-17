/* ===================================================
   FIREWORKS.JS — Fireworks & confetti effects
   =================================================== */

function launchFireworks() {
  const canvas = document.getElementById('fireworks-canvas');
  const ctx = canvas.getContext('2d');
  canvas.classList.add('active');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let fireworks = [];
  let particles = [];
  const colors = ['#FFD700', '#C9707D', '#F7E7CE', '#FF6B6B', '#A3424F', '#F5D5D8', '#D4A853'];

  class Firework {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height;
      this.targetY = Math.random() * canvas.height * 0.4 + 50;
      this.speed = 4 + Math.random() * 3;
      this.alive = true;
    }

    update() {
      this.y -= this.speed;
      if (this.y <= this.targetY) {
        this.alive = false;
        this.explode();
      }
    }

    explode() {
      const count = 50 + Math.floor(Math.random() * 30);
      const color = colors[Math.floor(Math.random() * colors.length)];
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 / count) * i;
        const vel = 2 + Math.random() * 3;
        particles.push({
          x: this.x,
          y: this.y,
          vx: Math.cos(angle) * vel,
          vy: Math.sin(angle) * vel,
          alpha: 1,
          color: color,
          r: 1.5 + Math.random()
        });
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#FFD700';
      ctx.fill();
    }
  }

  let frame = 0;

  function animate() {
    ctx.fillStyle = 'rgba(26, 18, 21, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Launch new fireworks periodically
    if (frame % 25 === 0 && frame < 200) {
      fireworks.push(new Firework());
    }

    // Update fireworks
    fireworks = fireworks.filter(f => f.alive);
    fireworks.forEach(f => {
      f.update();
      f.draw();
    });

    // Update particles
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.04;  // gravity
      p.vx *= 0.99;  // drag
      p.alpha -= 0.008;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    particles = particles.filter(p => p.alpha > 0);

    frame++;
    if (frame < 350) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.classList.remove('active');
    }
  }

  animate();
}

function burstConfetti() {
  const colors = ['#FFD700', '#C9707D', '#F7E7CE', '#A3424F', '#F5D5D8', '#D4A853', '#FF6B6B'];

  for (let i = 0; i < 80; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.left = Math.random() * 100 + 'vw';
    el.style.top = '-10px';
    el.style.width = (Math.random() * 8 + 4) + 'px';
    el.style.height = (Math.random() * 8 + 4) + 'px';
    el.style.background = colors[Math.floor(Math.random() * colors.length)];
    el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    el.style.animationDuration = (Math.random() * 2 + 2) + 's';
    el.style.animationDelay = (Math.random() * 0.5) + 's';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  }
}
