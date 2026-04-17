/* ===================================================
   MUSIC.JS — Birthday melody using Web Audio API
   =================================================== */

let audioCtx = null;
let musicPlaying = false;
let musicNodes = [];

function createBirthdayMusic() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const tempo = 130;
  const beatDur = 60 / tempo;

  // Happy Birthday melody notes
  const melody = [
    { n: 'C4', d: 0.75 }, { n: 'C4', d: 0.25 }, { n: 'D4', d: 1 },
    { n: 'C4', d: 1 },    { n: 'F4', d: 1 },    { n: 'E4', d: 2 },

    { n: 'C4', d: 0.75 }, { n: 'C4', d: 0.25 }, { n: 'D4', d: 1 },
    { n: 'C4', d: 1 },    { n: 'G4', d: 1 },    { n: 'F4', d: 2 },

    { n: 'C4', d: 0.75 }, { n: 'C4', d: 0.25 }, { n: 'C5', d: 1 },
    { n: 'A4', d: 1 },    { n: 'F4', d: 1 },    { n: 'E4', d: 1 },
    { n: 'D4', d: 1 },

    { n: 'Bb4', d: 0.75 }, { n: 'Bb4', d: 0.25 }, { n: 'A4', d: 1 },
    { n: 'F4', d: 1 },     { n: 'G4', d: 1 },     { n: 'F4', d: 2 }
  ];

  // Note frequencies (Hz)
  const freq = {
    'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23,
    'G4': 392.00, 'A4': 440.00, 'Bb4': 466.16, 'C5': 523.25
  };

  function playMelody(startTime) {
    let t = startTime;
    melody.forEach(m => {
      // Main sine oscillator
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();
      osc.type = 'sine';
      osc.frequency.value = freq[m.n];
      filter.type = 'lowpass';
      filter.frequency.value = 2000;

      // Secondary triangle oscillator for richness
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.value = freq[m.n];
      gain2.gain.value = 0.08;

      const dur = m.d * beatDur;

      // Envelope for main
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.12, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur - 0.02);

      // Envelope for secondary
      gain2.gain.setValueAtTime(0, t);
      gain2.gain.linearRampToValueAtTime(0.06, t + 0.05);
      gain2.gain.exponentialRampToValueAtTime(0.001, t + dur - 0.02);

      // Connect
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);

      // Play
      osc.start(t);
      osc.stop(t + dur);
      osc2.start(t);
      osc2.stop(t + dur);

      musicNodes.push(osc, osc2);
      t += dur;
    });
    return t;
  }

  function playPad(startTime, duration) {
    [130.81, 329.63, 392.00].forEach(fr => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = fr;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.03, startTime + 1);
      gain.gain.setValueAtTime(0.03, startTime + duration - 1);
      gain.gain.linearRampToValueAtTime(0, startTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration);
      musicNodes.push(osc);
    });
  }

  function loopMusic() {
    if (!musicPlaying) return;
    const now = audioCtx.currentTime;
    const totalDur = melody.reduce((s, m) => s + m.d * beatDur, 0);
    playPad(now, totalDur + 1);
    playMelody(now + 0.5);
    setTimeout(loopMusic, (totalDur + 1) * 1000);
  }

  loopMusic();
}

function toggleMusic() {
  const btn = document.getElementById('music-btn');
  if (!musicPlaying) {
    musicPlaying = true;
    btn.classList.add('playing');
    createBirthdayMusic();
  } else {
    musicPlaying = false;
    btn.classList.remove('playing');
    if (audioCtx) audioCtx.close();
    audioCtx = null;
    musicNodes = [];
  }
}
