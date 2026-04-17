/* ===================================================
   CANDLE.JS — Microphone blow detection & candle logic
   =================================================== */

let candleBlown = false;
let micStream = null;
let micAnalyser = null;
let micAnimFrame = null;
let blowDuration = 0;

const BLOW_THRESHOLD = 40;  // Volume level that counts as blowing
const BLOW_REQUIRED = 18;   // Frames above threshold needed to blow out

function startBlowing() {
  if (candleBlown) return;

  const btn = document.getElementById('blow-btn');
  const meter = document.getElementById('volume-meter');

  // If already listening, stop
  if (btn.classList.contains('listening')) {
    stopListening();
    return;
  }

  // Request microphone access
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      micStream = stream;
      btn.classList.add('listening');
      btn.querySelector('.btn-label').textContent = 'Listening...';
      meter.classList.add('active');
      document.getElementById('blow-text').textContent = '🌬️ Blow into your microphone now!';

      // Set up audio analysis
      const micCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = micCtx.createMediaStreamSource(stream);
      micAnalyser = micCtx.createAnalyser();
      micAnalyser.fftSize = 256;
      source.connect(micAnalyser);

      const dataArray = new Uint8Array(micAnalyser.frequencyBinCount);
      blowDuration = 0;

      function checkVolume() {
        if (candleBlown) return;

        micAnalyser.getByteFrequencyData(dataArray);

        // Calculate average volume
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
        const avg = sum / dataArray.length;

        // Update volume meter bar
        const pct = Math.min(100, (avg / 80) * 100);
        document.getElementById('volume-fill').style.width = pct + '%';

        const flame = document.getElementById('flame');

        if (avg > BLOW_THRESHOLD) {
          blowDuration++;

          // Make the flame visually react to blowing
          const intensity = Math.min(1, blowDuration / BLOW_REQUIRED);
          flame.style.filter = 'blur(' + (intensity * 3) + 'px)';
          flame.style.opacity = 1 - intensity * 0.6;
          flame.style.transform =
            'scaleX(' + (1 + intensity * 1.5) + ') ' +
            'scaleY(' + (1 - intensity * 0.4) + ') ' +
            'translateX(' + (intensity * 8) + 'px)';

          // If blown long enough, extinguish!
          if (blowDuration >= BLOW_REQUIRED) {
            blowOutCandle();
            stopListening();
            micCtx.close();
          }
        } else {
          // Gradually recover if blow stops
          blowDuration = Math.max(0, blowDuration - 2);
          const intensity = Math.min(1, blowDuration / BLOW_REQUIRED);
          flame.style.filter = 'blur(' + (intensity * 3) + 'px)';
          flame.style.opacity = 1 - intensity * 0.6;
          flame.style.transform =
            'scaleX(' + (1 + intensity * 1.5) + ') ' +
            'scaleY(' + (1 - intensity * 0.4) + ')';
        }

        micAnimFrame = requestAnimationFrame(checkVolume);
      }

      checkVolume();
    })
    .catch(() => {
      // Mic denied — fall back to tap
      document.getElementById('blow-text').textContent =
        'Mic not available — tap the flame instead!';
      document.getElementById('flame-container').style.cursor = 'pointer';
      document.getElementById('flame-container').onclick = () => {
        if (!candleBlown) blowOutCandle();
      };
    });
}

function stopListening() {
  const btn = document.getElementById('blow-btn');
  btn.classList.remove('listening');
  btn.querySelector('.btn-label').textContent = 'Tap & Blow';
  document.getElementById('volume-meter').classList.remove('active');
  document.getElementById('volume-fill').style.width = '0%';

  if (micAnimFrame) cancelAnimationFrame(micAnimFrame);
  if (micStream) {
    micStream.getTracks().forEach(t => t.stop());
    micStream = null;
  }
}

function blowOutCandle() {
  candleBlown = true;

  const flame = document.getElementById('flame');
  const glow = flame.previousElementSibling;

  // Clear any inline mic styles
  flame.style.filter = '';
  flame.style.opacity = '';
  flame.style.transform = '';

  // Blow-out animation
  flame.classList.add('blown-out');
  glow.style.transition = 'opacity 0.5s';
  glow.style.opacity = '0';

  // Update UI
  document.getElementById('blow-btn').style.display = 'none';
  document.getElementById('volume-meter').style.display = 'none';

  const blowText = document.getElementById('blow-text');
  blowText.innerHTML = '🎉 Your wish has been sent to the stars! 🎉';
  blowText.style.animation = 'none';
  blowText.style.opacity = '1';
  blowText.style.color = 'var(--champagne)';
  blowText.style.fontSize = '1.2rem';

  // Trigger celebrations
  launchFireworks();
  setTimeout(() => burstConfetti(), 500);
}
