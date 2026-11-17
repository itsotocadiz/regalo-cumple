(() => {
  'use strict';

  const { CONFIG } = window.RegaloApp;

  class AudioEngine {
    constructor({ onStatusChange, onTrackChange }) {
      this.onStatusChange = onStatusChange;
      this.onTrackChange = onTrackChange;
      this.audio = new Audio(CONFIG.audioSrc);
      this.audio.loop = true;
      this.audio.preload = 'metadata';
      this.audioCtx = null;
      this.analyser = null;
      this.dataArray = null;
      this.isPlaying = false;
      this.usingFallback = false;
      this.lofiInterval = null;
      this.soundEnabled = true;

      // Estado para el sonido ambiental de olas del mar en el video de la playa
      this.oceanEnabled = true;
      this.oceanNodes = null;
      this.oceanLfoInterval = null;

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
        // Silencioso si el navegador restringe MediaElementSource en protocolo local
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
        if (!this.isPlaying || !this.audioCtx || document.hidden) return;
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

    // Sonido inmersivo de olas del mar y brisa marina en tiempo real
    startOceanAmbience() {
      if (!this.oceanEnabled) return;
      const ctx = this.ensureContext();
      if (!ctx || this.oceanNodes) return;

      try {
        const bufferSize = ctx.sampleRate * 4;
        const noiseBuffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
        for (let ch = 0; ch < 2; ch++) {
          const output = noiseBuffer.getChannelData(ch);
          let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.035;
            b6 = white * 0.115926;
          }
        }

        const source = ctx.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(420, ctx.currentTime);
        filter.Q.setValueAtTime(0.9, ctx.currentTime);

        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.01, ctx.currentTime);
        masterGain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 1.2);

        source.connect(filter);
        filter.connect(masterGain);
        masterGain.connect(ctx.destination);
        source.start();

        this.oceanNodes = { source, filter, masterGain };

        const triggerWaveSwell = () => {
          if (!this.oceanNodes || !this.audioCtx || document.hidden) return;
          const now = this.audioCtx.currentTime;
          this.oceanNodes.filter.frequency.cancelScheduledValues(now);
          this.oceanNodes.filter.frequency.setValueAtTime(340, now);
          this.oceanNodes.filter.frequency.exponentialRampToValueAtTime(1150, now + 2.1);
          this.oceanNodes.filter.frequency.exponentialRampToValueAtTime(320, now + 4.8);

          this.oceanNodes.masterGain.gain.cancelScheduledValues(now);
          this.oceanNodes.masterGain.gain.setValueAtTime(0.12, now);
          this.oceanNodes.masterGain.gain.linearRampToValueAtTime(0.28, now + 2.0);
          this.oceanNodes.masterGain.gain.linearRampToValueAtTime(0.11, now + 4.8);

          // Canto de gaviotas costeras a lo lejos
          this.playSeagullPair(0.8);
        };

        triggerWaveSwell();
        this.oceanLfoInterval = setInterval(triggerWaveSwell, 5000);
      } catch {
        // Silencioso si el navegador bloquea Web Audio
      }
    }

    playSeagullPair(delaySec = 0.2) {
      const ctx = this.ensureContext();
      if (!ctx || document.hidden) return;
      [0, 0.62].forEach((offset, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const t = ctx.currentTime + delaySec + offset;
        const dur = idx === 0 ? 0.52 : 0.44;
        const peak = idx === 0 ? 2120 : 1980;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(peak * 0.74, t);
        osc.frequency.exponentialRampToValueAtTime(peak, t + dur * 0.28);
        osc.frequency.exponentialRampToValueAtTime(peak * 0.62, t + dur);
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(0.032, t + dur * 0.22);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + dur + 0.02);
      });
    }

    stopOceanAmbience() {
      if (this.oceanLfoInterval) {
        clearInterval(this.oceanLfoInterval);
        this.oceanLfoInterval = null;
      }
      if (this.oceanNodes && this.audioCtx) {
        try {
          const now = this.audioCtx.currentTime;
          const { source, masterGain } = this.oceanNodes;
          masterGain.gain.cancelScheduledValues(now);
          masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.35);
          setTimeout(() => {
            try { source.stop(); source.disconnect(); } catch {}
          }, 400);
        } catch {}
        this.oceanNodes = null;
      }
    }

    toggleOceanAmbience() {
      this.oceanEnabled = !this.oceanEnabled;
      if (this.oceanEnabled) {
        this.startOceanAmbience();
      } else {
        this.stopOceanAmbience();
      }
      return this.oceanEnabled;
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

    playStarChime() {
      const ctx = this.ensureContext();
      if (!ctx) return;
      const freqs = [587.33, 880.0, 1174.66, 1567.98];
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const start = ctx.currentTime + i * 0.07;
        osc.frequency.setValueAtTime(f, start);
        gain.gain.setValueAtTime(0.001, start);
        gain.gain.exponentialRampToValueAtTime(0.045, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.65);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.7);
      });
    }

    playPuppyBark(baseFreq = 520) {
      const ctx = this.ensureContext();
      if (!ctx) return;
      [0, 0.14].forEach((offset, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const t = ctx.currentTime + offset;
        const f = baseFreq * (idx === 1 ? 1.12 : 1.0);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f * 0.75, t);
        osc.frequency.exponentialRampToValueAtTime(f * 1.35, t + 0.045);
        osc.frequency.exponentialRampToValueAtTime(f * 0.6, t + 0.11);
        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.06, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.125);
      });
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

  window.RegaloApp.AudioEngine = AudioEngine;
})();
