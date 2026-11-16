class AudioEngine {
  constructor({ onStatusChange, onTrackChange }) {
    this.onStatusChange = onStatusChange;
    this.onTrackChange = onTrackChange;
    this.audio = new Audio(CONFIG.audioSrc);
    this.audio.loop = true;
    this.audioCtx = null;
    this.analyser = null;
    this.dataArray = null;
    this.isPlaying = false;
    this.usingFallback = false;
    this.lofiInterval = null;
    this.soundEnabled = true;

    this.audio.addEventListener('error', () => {
      if (this.isPlaying && !this.usingFallback) {
        this.startLofiFallback();
      }
    });
  }

  ensureContext() {
    if (!this.audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) {
        this.audioCtx = new Ctx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  setupAnalyserForElement() {
    const ctx = this.ensureContext();
    if (!ctx || this.analyser) return;
    try {
      const source = ctx.createMediaElementSource(this.audio);
      this.analyser = ctx.createAnalyser();
      this.analyser.fftSize = 32;
      source.connect(this.analyser);
      this.analyser.connect(ctx.destination);
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    } catch {
      // Silencioso si el navegador restringe MediaElementSource
    }
  }

  async togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      await this.play();
    }
  }

  async play() {
    this.ensureContext();
    if (!this.usingFallback) {
      try {
        this.setupAnalyserForElement();
        await this.audio.play();
        this.isPlaying = true;
        this.onTrackChange?.(CONFIG.songTitle, CONFIG.songArtist);
        this.onStatusChange?.(true, 'Reproduciendo');
        return;
      } catch {
        this.startLofiFallback();
        return;
      }
    }
    this.startLofiFallback();
  }

  pause() {
    this.isPlaying = false;
    this.audio.pause();
    if (this.lofiInterval) {
      clearInterval(this.lofiInterval);
      this.lofiInterval = null;
    }
    this.onStatusChange?.(false, 'Pausado');
  }

  startLofiFallback() {
    this.usingFallback = true;
    const ctx = this.ensureContext();
    if (!ctx) return;

    this.isPlaying = true;
    this.onTrackChange?.(CONFIG.fallbackTitle, CONFIG.fallbackArtist);
    this.onStatusChange?.(true, 'Sintetizador activo');

    if (this.lofiInterval) clearInterval(this.lofiInterval);
    const chords = [
      [261.63, 329.63, 392.0, 493.88],
      [220.0, 261.63, 329.63, 392.0],
      [174.61, 220.0, 261.63, 349.23],
      [196.0, 246.94, 293.66, 392.0]
    ];
    let step = 0;

    const playChord = () => {
      if (!this.isPlaying || !this.audioCtx) return;
      const notes = chords[step % chords.length];
      step++;
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const now = ctx.currentTime;
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.018 / (idx + 1), now + 0.35);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 2.4);
      });
    };

    playChord();
    this.lofiInterval = setInterval(playChord, 2500);
  }

  playTypeClick() {
    if (!this.soundEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(720 + Math.random() * 180, ctx.currentTime);
    gain.gain.setValueAtTime(0.012, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.035);
  }

  getVisualizerLevels(barsCount = 4) {
    if (!this.isPlaying) return Array(barsCount).fill(20);
    if (this.analyser && this.dataArray && !this.usingFallback) {
      this.analyser.getByteFrequencyData(this.dataArray);
      const out = [];
      for (let i = 0; i < barsCount; i++) {
        const val = this.dataArray[i * 2] || 40;
        out.push(Math.max(22, Math.min(100, Math.round((val / 255) * 100))));
      }
      return out;
    }
    return Array.from({ length: barsCount }, () => 30 + Math.round(Math.random() * 65));
  }
}
