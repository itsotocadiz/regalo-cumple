const $ = (sel) => document.querySelector(sel);

// --- Motor de Audio ---
const audioEngine = new AudioEngine({
  onStatusChange: (playing, label) => {
    const vinyl = $('#vinyl-disc');
    const status = $('#song-status');
    const iconPlay = $('#icon-play');
    const iconPause = $('#icon-pause');
    if (vinyl) {
      vinyl.classList.toggle('vinyl-spinning', playing);
      vinyl.classList.toggle('vinyl-paused', !playing);
    }
    if (status) status.textContent = label;
    if (iconPlay && iconPause) {
      iconPlay.classList.toggle('hidden', playing);
      iconPause.classList.toggle('hidden', !playing);
    }
  },
  onTrackChange: (title, artist) => {
    const t = $('#song-title');
    const a = $('#song-artist');
    if (t) t.textContent = title;
    if (a) a.textContent = artist;
  }
});

// --- Confeti seguro ---
function fireConfetti(options = {}) {
  if (typeof window.confetti === 'function') {
    window.confetti({
      particleCount: 70,
      spread: 75,
      origin: { y: 0.65 },
      colors: ['#e11d48', '#fb7185', '#ffd5dd', '#f6d38b', '#fbf7f4'],
      ...options
    });
  }
}

// --- 1. Gatekeeper (Pantalla de Bloqueo) ---
function initGatekeeper() {
  const overlay = $('#gatekeeper-screen');
  const card = $('#gatekeeper-card');
  const input = $('#secret-input');
  const btn = $('#btn-unlock');
  const err = $('#error-msg');
  const hintBtn = $('#btn-hint');
  const hintBox = $('#hint-box');
  const pawDots = document.querySelectorAll('.paw-dot');

  const updatePaws = (val) => {
    const len = val.trim().length;
    pawDots.forEach((dot, idx) => {
      dot.classList.toggle('is-active', idx < len);
    });
  };

  input?.addEventListener('input', (e) => {
    err?.classList.add('hidden');
    updatePaws(e.target.value);
  });

  hintBtn?.addEventListener('click', () => {
    hintBox?.classList.toggle('hidden');
  });

  const attemptUnlock = () => {
    const value = (input?.value || '').trim().toLowerCase();
    if (value === CONFIG.claveCorrecta) {
      navigator.vibrate?.([30, 40, 60]);
      overlay?.classList.add('is-unlocked');
      document.body.classList.remove('overflow-hidden');
      fireConfetti({ particleCount: 95, spread: 90, origin: { y: 0.6 } });
      setTimeout(() => fireConfetti({ particleCount: 55, angle: 60, spread: 55, origin: { x: 0.1, y: 0.7 } }), 220);
      setTimeout(() => fireConfetti({ particleCount: 55, angle: 120, spread: 55, origin: { x: 0.9, y: 0.7 } }), 220);
      audioEngine.play();
    } else {
      navigator.vibrate?.([60, 40, 60]);
      err?.classList.remove('hidden');
      card?.classList.remove('animate-shake');
      void card?.offsetWidth;
      card?.classList.add('animate-shake');
    }
  };

  btn?.addEventListener('click', attemptUnlock);
  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') attemptUnlock();
  });
}

// --- 2. Cielo Estrellado en Canvas + Halo de Cursor ---
function initSkyAndHalo() {
  const canvas = $('#sky-canvas');
  const halo = $('#cursor-halo');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (halo && !prefersReduced) {
    window.addEventListener('pointermove', (e) => {
      halo.style.left = `${e.clientX}px`;
      halo.style.top = `${e.clientY}px`;
    }, { passive: true });
  }

  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let stars = [];
  let rafId = null;

  const resize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    const count = Math.min(85, Math.max(35, Math.floor((width * height) / 22000)));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.6 + 0.4,
      alpha: Math.random() * 0.6 + 0.2,
      speed: Math.random() * 0.015 + 0.005,
      phase: Math.random() * Math.PI * 2,
      warm: Math.random() > 0.7
    }));
  };

  resize();
  window.addEventListener('resize', resize);

  const draw = (time) => {
    ctx.clearRect(0, 0, width, height);
    const scrollOffset = window.scrollY * 0.06;
    for (const s of stars) {
      const twinkle = prefersReduced ? s.alpha : s.alpha + Math.sin(time * 0.002 * (s.speed * 100) + s.phase) * 0.25;
      const yPos = ((s.y - scrollOffset) % height + height) % height;
      ctx.beginPath();
      ctx.arc(s.x, yPos, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.warm
        ? `rgba(246, 211, 139, ${Math.max(0.1, twinkle)})`
        : `rgba(255, 213, 221, ${Math.max(0.1, twinkle)})`;
      ctx.fill();
    }
    if (!prefersReduced) {
      rafId = requestAnimationFrame(draw);
    }
  };

  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(draw);

  // Estrella tributo de Romeo
  const starBtn = $('#romeo-star-btn');
  const starPopover = $('#romeo-star-popover');
  starBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    starPopover?.classList.toggle('hidden');
  });
  document.addEventListener('click', () => {
    starPopover?.classList.add('hidden');
  });
}

// --- 3. Contadores Bento Grid ---
function initCounters() {
  const now = new Date();
  const diffMs = Math.max(0, now - CONFIG.fechaInicio);
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Insignia del 27 de noviembre
  if (now.getDate() === 27 && now.getMonth() === 10) {
    $('#bday-special-badge')?.classList.remove('hidden');
  }

  // Segundero en vivo
  const updateLiveClock = () => {
    const current = new Date();
    const ms = Math.max(0, current - CONFIG.fechaInicio);
    const days = Math.floor(ms / 86400000);
    const hours = Math.floor((ms % 86400000) / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);

    const setTxt = (id, val) => {
      const el = $(id);
      if (el) el.textContent = String(val).padStart(2, '0');
    };
    const daysEl = $('#live-days');
    if (daysEl) daysEl.textContent = days.toLocaleString('es-CL');
    setTxt('#live-hours', hours);
    setTxt('#live-minutes', minutes);
    setTxt('#live-seconds', seconds);
  };

  updateLiveClock();
  setInterval(updateLiveClock, 1000);

  // Animación de contadores al entrar en viewport
  const animateValue = (el, target) => {
    const duration = 1500;
    const start = performance.now();
    const tick = (nowTs) => {
      const progress = Math.min(1, (nowTs - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 4);
      el.textContent = Math.round(target * eased).toLocaleString('es-CL');
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const targets = {
    'counter-days': totalDays,
    'counter-smiles': totalDays * 3,
    'counter-wishes': 365
  };

  const container = $('#counters-bento');
  if (!container) return;

  let animated = false;
  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting) && !animated) {
      animated = true;
      Object.entries(targets).forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (el) animateValue(el, val);
      });
      observer.disconnect();
    }
  }, { threshold: 0.25 });

  observer.observe(container);
}

// --- 4. Galería Polaroid 3D + Lightbox con Swipe ---
function buildFallbackArtwork(recuerdo) {
  return `
    <div class="w-full h-full flex flex-col items-center justify-center p-5 text-center rounded-lg bg-gradient-to-br from-[#2a111a] via-[#1b0b11] to-[#3b1523] text-[#fbf7f4] border border-rose-200/15">
      <svg class="w-10 h-10 text-rose-300/80 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M12 21s-6.716-4.35-9.193-8.11C.695 9.685 2.09 5.5 5.83 4.55 8.03 3.99 10.35 4.88 12 6.7c1.65-1.82 3.97-2.71 6.17-2.15 3.74.95 5.135 5.135 3.023 8.34C18.716 16.65 12 21 12 21z"/>
      </svg>
      <span class="text-[11px] uppercase tracking-[0.22em] text-rose-200/70 mb-1">${recuerdo.etiqueta}</span>
      <p class="font-serif-display text-lg text-rose-50">${recuerdo.titulo}</p>
      <span class="text-[11px] text-rose-200/60 mt-2">Foto disponible en el repositorio</span>
    </div>
  `;
}

function initGallery() {
  const grid = $('#polaroid-grid');
  if (!grid) return;

  let activeIndex = 0;

  grid.innerHTML = RECUERDOS.map((rec, idx) => `
    <article class="polaroid-scene group" data-index="${idx}">
      <div class="polaroid-card" role="button" tabindex="0" aria-label="Voltear recuerdo ${rec.titulo}">
        <div class="polaroid-face polaroid-front">
          <div class="relative flex-1 rounded-lg overflow-hidden bg-[#1e0c12]">
            <img
              src="${rec.src}"
              alt="${rec.titulo}"
              loading="lazy"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              onerror="this.parentElement.innerHTML = this.dataset.fallback"
              data-fallback='${buildFallbackArtwork(rec).replace(/'/g, '&#39;')}'
            />
            <div class="polaroid-glare"></div>
            <button
              type="button"
              class="btn-expand-photo absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/55 hover:bg-rose-600 text-white backdrop-blur-md flex items-center justify-center transition-colors border border-white/15"
              data-index="${idx}"
              aria-label="Ampliar ${rec.titulo}"
              title="Ampliar recuerdo"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
              </svg>
            </button>
          </div>
          <div class="pt-3 px-1 flex items-center justify-between gap-2">
            <div>
              <span class="block text-[10px] uppercase tracking-[0.2em] text-rose-900/55 font-semibold">${rec.etiqueta}</span>
              <h3 class="font-serif-display text-lg text-[#1e0c12] leading-tight">${rec.titulo}</h3>
            </div>
            <span class="text-[11px] font-medium text-rose-700 bg-rose-100 px-2.5 py-1 rounded-full">Voltear</span>
          </div>
        </div>

        <div class="polaroid-face polaroid-back">
          <div>
            <div class="flex items-center justify-between border-b border-rose-900/10 pb-2 mb-3">
              <span class="text-[11px] uppercase tracking-[0.2em] text-rose-800/70 font-semibold">${rec.titulo}</span>
              <span class="text-[11px] text-rose-900/45">${rec.etiqueta}</span>
            </div>
            <p class="font-serif-display text-[15px] sm:text-base leading-relaxed text-[#2a1219] whitespace-pre-line">${rec.nota}</p>
          </div>
          <div class="pt-3 border-t border-rose-900/10 flex items-center justify-between">
            <span class="font-mono-letter text-xs font-semibold tracking-wider text-rose-700">— ${rec.firma}</span>
            <span class="text-[11px] text-rose-900/50">Toca para volver</span>
          </div>
        </div>
      </div>
    </article>
  `).join('');

  // Tilt 3D + Flip
  grid.querySelectorAll('.polaroid-scene').forEach((scene) => {
    const card = scene.querySelector('.polaroid-card');
    const glare = scene.querySelector('.polaroid-glare');

    scene.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse' || card.classList.contains('is-flipped')) return;
      const rect = scene.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotX = (0.5 - y) * 12;
      const rotY = (x - 0.5) * 12;
      card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      if (glare) {
        glare.style.setProperty('--glare-x', `${x * 100}%`);
        glare.style.setProperty('--glare-y', `${y * 100}%`);
      }
    });

    scene.addEventListener('pointerleave', () => {
      if (!card.classList.contains('is-flipped')) {
        card.style.transform = '';
      }
    });

    card.addEventListener('click', (e) => {
      if (e.target.closest('.btn-expand-photo')) return;
      card.style.transform = '';
      card.classList.toggle('is-flipped');
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.style.transform = '';
        card.classList.toggle('is-flipped');
      }
    });
  });

  // Lightbox Modal + Swipe
  const modal = $('#lightbox-modal');
  const modalImg = $('#lightbox-img');
  const modalFallback = $('#lightbox-fallback');
  const modalTag = $('#lightbox-tag');
  const modalTitle = $('#lightbox-title');
  const modalPoem = $('#lightbox-poem');
  const modalSign = $('#lightbox-sign');

  const renderLightbox = (index) => {
    activeIndex = (index + RECUERDOS.length) % RECUERDOS.length;
    const rec = RECUERDOS[activeIndex];
    if (modalTag) modalTag.textContent = `${rec.etiqueta} • ${activeIndex + 1} / ${RECUERDOS.length}`;
    if (modalTitle) modalTitle.textContent = rec.titulo;
    if (modalPoem) modalPoem.textContent = rec.nota;
    if (modalSign) modalSign.textContent = `— ${rec.firma}`;

    if (modalImg && modalFallback) {
      modalImg.classList.remove('hidden');
      modalFallback.classList.add('hidden');
      modalImg.src = rec.src;
      modalImg.alt = rec.titulo;
      modalImg.onerror = () => {
        modalImg.classList.add('hidden');
        modalFallback.classList.remove('hidden');
        modalFallback.innerHTML = buildFallbackArtwork(rec);
      };
    }
  };

  const openLightbox = (idx) => {
    renderLightbox(idx);
    modal?.classList.remove('hidden');
    modal?.classList.add('flex');
  };

  const closeLightbox = () => {
    modal?.classList.add('hidden');
    modal?.classList.remove('flex');
  };

  grid.querySelectorAll('.btn-expand-photo').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openLightbox(Number(btn.dataset.index));
    });
  });

  $('#lightbox-close')?.addEventListener('click', closeLightbox);
  $('#lightbox-prev')?.addEventListener('click', () => renderLightbox(activeIndex - 1));
  $('#lightbox-next')?.addEventListener('click', () => renderLightbox(activeIndex + 1));
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (modal?.classList.contains('hidden')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') renderLightbox(activeIndex - 1);
    if (e.key === 'ArrowRight') renderLightbox(activeIndex + 1);
  });

  let touchStartX = 0;
  modal?.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  modal?.addEventListener('touchend', (e) => {
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 45) {
      renderLightbox(delta > 0 ? activeIndex - 1 : activeIndex + 1);
    }
  }, { passive: true });
}

// --- 5. Sobre Postal, Carta Mecanografiada y Sorpresa Flow ---
function initLetter() {
  const envelopeBox = $('#carta-envelope-teaser');
  const letterCard = $('#carta-card');
  const sealBtn = $('#btn-open-seal');
  const closeBtn = $('#btn-close-letter');
  const skipBtn = $('#btn-skip-typewriter');
  const soundBtn = $('#btn-toggle-type-sound');
  const bodyEl = $('#carta-body');
  const signEl = $('#carta-firma');
  const progressEl = $('#carta-progress');
  const flowSurpriseWrap = $('#carta-flow-surprise');

  let typingTimer = null;
  let isTyping = false;

  const fullText = PARRAFOS_CARTA.join('\n\n');

  const finishTyping = () => {
    if (typingTimer) clearTimeout(typingTimer);
    isTyping = false;
    if (bodyEl) bodyEl.textContent = fullText;
    if (progressEl) progressEl.style.width = '100%';
    skipBtn?.classList.add('hidden');
    signEl?.classList.remove('opacity-0', 'translate-y-3');
    if (flowSurpriseWrap) {
      flowSurpriseWrap.classList.remove('hidden');
      requestAnimationFrame(() => {
        flowSurpriseWrap.classList.remove('opacity-0', 'translate-y-3');
      });
    }
  };

  const startTyping = () => {
    if (!bodyEl) return;
    if (typingTimer) clearTimeout(typingTimer);
    isTyping = true;
    let idx = 0;
    bodyEl.textContent = '';
    signEl?.classList.add('opacity-0', 'translate-y-3');
    if (flowSurpriseWrap) {
      flowSurpriseWrap.classList.add('hidden', 'opacity-0', 'translate-y-3');
    }
    skipBtn?.classList.remove('hidden');

    const step = () => {
      if (!isTyping) return;
      idx += 2;
      const slice = fullText.slice(0, idx);
      bodyEl.innerHTML = `${slice.replace(/</g, '&lt;')}<span class="type-cursor"></span>`;
      if (progressEl) {
        progressEl.style.width = `${Math.min(100, Math.round((idx / fullText.length) * 100))}%`;
      }
      if (idx % 6 === 0) audioEngine.playTypeClick();

      if (idx < fullText.length) {
        typingTimer = setTimeout(step, 26);
      } else {
        finishTyping();
      }
    };
    step();
  };

  sealBtn?.addEventListener('click', () => {
    navigator.vibrate?.([25, 30, 45]);
    fireConfetti({ particleCount: 45, spread: 60, origin: { y: 0.7 } });
    envelopeBox?.classList.add('hidden');
    letterCard?.classList.remove('hidden');
    startTyping();
  });

  skipBtn?.addEventListener('click', finishTyping);

  closeBtn?.addEventListener('click', () => {
    if (typingTimer) clearTimeout(typingTimer);
    isTyping = false;
    letterCard?.classList.add('hidden');
    envelopeBox?.classList.remove('hidden');
  });

  soundBtn?.addEventListener('click', () => {
    audioEngine.soundEnabled = !audioEngine.soundEnabled;
    soundBtn.textContent = audioEngine.soundEnabled ? 'Sonido: ON' : 'Sonido: OFF';
  });
}

// --- 5B. Modal Sorpresa de Video Flow (Caricatura en la Playa) ---
function initFlowVideoModal() {
  const openBtn = $('#btn-open-flow-video');
  const modal = $('#flow-video-modal');
  const closeBtn = $('#flow-video-close');
  const replayBtn = $('#flow-video-replay');
  const videoEl = $('#flow-video-player');

  if (!modal) return;

  const openModal = () => {
    navigator.vibrate?.([35, 30, 65]);
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    fireConfetti({ particleCount: 80, spread: 85, origin: { y: 0.65 } });
    if (!audioEngine.isPlaying) {
      audioEngine.play();
    }
    if (videoEl) {
      videoEl.currentTime = 0;
      videoEl.play().catch(() => {});
    }
  };

  const closeModal = () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    if (videoEl) {
      videoEl.pause();
    }
  };

  openBtn?.addEventListener('click', openModal);
  closeBtn?.addEventListener('click', closeModal);
  replayBtn?.addEventListener('click', () => {
    if (videoEl) {
      videoEl.currentTime = 0;
      videoEl.play().catch(() => {});
      fireConfetti({ particleCount: 45, spread: 65, origin: { y: 0.7 } });
    }
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('hidden') && e.key === 'Escape') {
      closeModal();
    }
  });
}

// --- 6. Abrazo Virtual ---
function initVirtualHug() {
  const btn = $('#btn-virtual-hug');
  const toast = $('#hug-toast');
  const countEl = $('#hug-count');
  let hugs = 0;

  btn?.addEventListener('click', () => {
    hugs++;
    if (countEl) countEl.textContent = String(hugs);
    navigator.vibrate?.([40, 30, 80]);
    fireConfetti({ particleCount: 55, spread: 80, origin: { y: 0.75 } });

    const rect = btn.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;

    for (let i = 0; i < 14; i++) {
      const p = document.createElement('span');
      p.className = 'hug-particle text-rose-400';
      p.innerHTML = `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-6.716-4.35-9.193-8.11C.695 9.685 2.09 5.5 5.83 4.55 8.03 3.99 10.35 4.88 12 6.7c1.65-1.82 3.97-2.71 6.17-2.15 3.74.95 5.135 5.135 3.023 8.34C18.716 16.65 12 21 12 21z"/></svg>`;
      p.style.left = `${originX}px`;
      p.style.top = `${originY}px`;
      p.style.setProperty('--tx', `${(Math.random() - 0.5) * 240}px`);
      p.style.setProperty('--ty', `${-120 - Math.random() * 140}px`);
      p.style.setProperty('--rot', `${(Math.random() - 0.5) * 45}deg`);
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 1850);
    }

    if (toast) {
      toast.textContent = MENSAJES_ABRAZO[(hugs - 1) % MENSAJES_ABRAZO.length];
      toast.classList.remove('opacity-0', 'translate-y-2');
    }
  });
}

// --- 7. Reproductor de Vinilo Flotante ---
function initMusicPlayer() {
  const toggleBtn = $('#btn-toggle-music');
  const bars = document.querySelectorAll('.eq-bar');

  toggleBtn?.addEventListener('click', () => {
    audioEngine.togglePlay();
  });

  setInterval(() => {
    const levels = audioEngine.getVisualizerLevels(bars.length);
    bars.forEach((bar, i) => {
      bar.style.height = `${Math.max(20, levels[i])}%`;
    });
  }, 160);
}

// --- Inicialización ---
document.addEventListener('DOMContentLoaded', () => {
  initGatekeeper();
  initSkyAndHalo();
  initCounters();
  initGallery();
  initLetter();
  initFlowVideoModal();
  initVirtualHug();
  initMusicPlayer();
});
