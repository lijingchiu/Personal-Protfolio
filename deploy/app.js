// ════════════════════════════════════════════════════════════
// app.js — DOM controller (classic script, runs at end of body)
//  · Lenis smooth scroll → gsap.ticker → ScrollTrigger
//  · i18n ZH/EN  ·  light/dark toggle
//  · scroll reveals, light→dark transition, masked video, pin story
//  Talks to the WebGL layer via window.__hero
// ════════════════════════════════════════════════════════════
(function () {
  const gsap = window.gsap;
  gsap.registerPlugin(window.ScrollTrigger);
  const ST = window.ScrollTrigger;

  /* ─────────── i18n ─────────── */
  const I18N = {
    zh: {
      'nav.work': '作品', 'nav.about': '關於', 'nav.contact': '聯絡', 'nav.talk': '聊聊合作',
      'nav.resume': '履歷表', 'nav.portfolio': '作品集',
      'hero.eyebrow': 'VFX ARTIST · UNITY3D SHADER',
      'hero.lede': '遊戲特效 × 沉浸式展覽 × AI 輔助開發 — 以 Particle System 與 Shader 打造令人印象深刻的視覺體驗。',
      'hero.cta': '查看我的作品', 'scroll': 'SCROLL',
      'zone.k': '深度滾動敘事',
      'zone.1a': '穿越', 'zone.1b': '畫面',
      'zone.1s': '滾動，進入特效的宇宙。',
      'zone.2a': 'PARTICLE', 'zone.2b': 'SYSTEM',
      'zone.2s': '粒子、光絲與動態，凝聚成情感的力量。',
      'zone.3a': 'SHADER', 'zone.3b': 'ARTISTRY',
      'zone.3s': '每一道光澤，皆由程式雕琢而成。',
      'zone.hint': '繼續滾動',
      'reveal.label': 'SHOWREEL', 'reveal.cta': '觀看作品集影片',
      'work.k': '精選作品', 'work.title': '作品集', 'work.lead': '遊戲特效、沉浸式展覽與實驗性視覺專案。',
      'work.1t': '東方風格 3A 遊戲特效', 'work.2t': '1914 沉浸式展覽',
      'work.3t': 'Shader 實驗', 'work.4t': '自由接案專案', 'work.5t': '個人實驗',
      'about.k': '關於我', 'about.title': '用特效\n點亮每個畫面',
      'about.bio1': '我是邱立璟，基隆人，Unity3D 視覺特效師。現任職於遊戲科技公司擔任特效師，曾參與 3A 等級東方風格遊戲開發，擁有互動沉浸式展覽專案經驗，同時有自由接案經驗。',
      'about.bio2': '擅長以 Particle System、Shader Graph 與 AI 輔助工具（Claude Code、Codex、Gemini）加速開發流程，並持有 JLPT N1 日文檢定，可進行跨語言協作。',
      'stat.1': '年資歷', 'stat.2': '工作職位', 'stat.3': '放視大賞決選',
      'tools.k': '工具使用', 'spec.k': '專長領域',
      'foot.big': "LET'S\nTALK", 'foot.role': 'VFX Artist · 視覺特效師', 'foot.loc': 'Keelung, Taiwan',
    },
    en: {
      'nav.work': 'Work', 'nav.about': 'About', 'nav.contact': 'Contact', 'nav.talk': "Let's Talk",
      'nav.resume': 'Resume', 'nav.portfolio': 'Portfolio',
      'hero.eyebrow': 'VFX ARTIST · UNITY3D SHADER',
      'hero.lede': 'Game VFX × Immersive Exhibitions × AI-assisted dev — crafting memorable visuals with Particle Systems and Shader art.',
      'hero.cta': 'View My Work', 'scroll': 'SCROLL',
      'zone.k': 'Scroll-driven story',
      'zone.1a': 'INTO THE', 'zone.1b': 'FRAME',
      'zone.1s': 'Scroll to enter the universe of visual effects.',
      'zone.2a': 'PARTICLE', 'zone.2b': 'SYSTEM',
      'zone.2s': 'Particles, light trails and motion — forged into emotion.',
      'zone.3a': 'SHADER', 'zone.3b': 'ARTISTRY',
      'zone.3s': 'Every highlight, sculpted by code.',
      'zone.hint': 'Keep scrolling',
      'reveal.label': 'SHOWREEL', 'reveal.cta': 'Watch the reel',
      'work.k': 'Selected work', 'work.title': 'Portfolio', 'work.lead': 'Game VFX, immersive exhibitions and experimental visual projects.',
      'work.1t': 'Eastern-style 3A Game VFX', 'work.2t': '1914 Immersive Exhibition',
      'work.3t': 'Shader Experiments', 'work.4t': 'Freelance Projects', 'work.5t': 'Personal R&D',
      'about.k': 'About me', 'about.title': 'Every frame,\nlit by VFX',
      'about.bio1': "I'm Lijing Chiu from Keelung, Taiwan — a Unity3D VFX artist currently working at a game tech studio. I've participated in 3A-quality Eastern-style game development, have experience in interactive immersive exhibition projects, and also take on freelance work.",
      'about.bio2': 'I accelerate pipelines with Particle System, Shader Graph and AI tools (Claude Code, Codex, Gemini). JLPT N1 certified — able to collaborate across languages.',
      'stat.1': 'Yrs Exp.', 'stat.2': 'Roles', 'stat.3': '放視大賞 Award',
      'tools.k': 'Tools', 'spec.k': 'Specialisms',
      'foot.big': "LET'S\nTALK", 'foot.role': 'VFX Artist · Unity3D Shader', 'foot.loc': 'Keelung, Taiwan',
    },
  };

  function applyLang(lang) {
    const dict = I18N[lang];
    document.documentElement.lang = lang === 'zh' ? 'zh-TW' : 'en';
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const k = el.getAttribute('data-i18n');
      if (dict[k] == null) return;
      if (el.dataset.i18nHtml === 'br') el.innerHTML = dict[k].replace(/\n/g, '<br>');
      else el.textContent = dict[k];
    });
    document.querySelectorAll('[data-lang-btn]').forEach(b =>
      b.setAttribute('aria-pressed', b.dataset.langBtn === lang));
    localStorage.setItem('lc_lang', lang);
  }

  /* ─────────── theme toggle (manual) ─────────── */
  let manualTheme = localStorage.getItem('lc_theme') || 'light';
  function applyTheme(theme, fromScroll) {
    document.documentElement.setAttribute('data-theme', theme);
    document.querySelectorAll('[data-theme-btn]').forEach(b =>
      b.setAttribute('aria-pressed', b.dataset.themeBtn === theme));
    if (!fromScroll) { manualTheme = theme; localStorage.setItem('lc_theme', theme); }
    if (window.__hero) window.__hero.setTheme(theme === 'dark' ? 1 : 0);
  }

  /* ─────────── boot ─────────── */
  function boot() {
    applyLang(localStorage.getItem('lc_lang') || 'zh');
    applyTheme(manualTheme);

    // toggles
    document.querySelectorAll('[data-lang-btn]').forEach(b =>
      b.addEventListener('click', () => applyLang(b.dataset.langBtn)));
    document.querySelectorAll('[data-theme-btn]').forEach(b =>
      b.addEventListener('click', () => applyTheme(b.dataset.themeBtn)));

    // mobile menu
    const burger = document.getElementById('burger');
    const mob = document.getElementById('mob');
    if (burger) burger.addEventListener('click', () => {
      const open = mob.classList.toggle('open');
      burger.setAttribute('aria-expanded', open);
      if (window.__lenis) open ? window.__lenis.stop() : window.__lenis.start();
    });
    mob && mob.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mob.classList.remove('open'); burger.setAttribute('aria-expanded', false);
      window.__lenis && window.__lenis.start();
    }));

    initLenis();
    initScroll();
  }

  /* ─────────── Lenis → gsap.ticker → ScrollTrigger ─────────── */
  function initLenis() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lenis = new Lenis({ lerp: reduce ? 1 : 0.1, smoothWheel: !reduce, wheelMultiplier: 1 });
    window.__lenis = lenis;
    lenis.on('scroll', ST.update);
    gsap.ticker.add(time => {
      lenis.raf(time * 1000);
      if (window.__hero && window.__hero.ready) window.__hero.frame(gsap.ticker.deltaRatio() * 16);
    });
    gsap.ticker.lagSmoothing(0);

    // anchor links via lenis
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const id = a.getAttribute('href');
        if (id.length > 1 && document.querySelector(id)) { e.preventDefault(); lenis.scrollTo(id, { offset: -10 }); }
      });
    });
  }

  /* ─────────── ScrollTrigger scenes ─────────── */
  function initScroll() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // overall page progress → crystals recede
    ST.create({
      start: 0, end: 'max',
      onUpdate: self => window.__hero && window.__hero.setScroll(self.progress),
    });

    // generic reveals (spring-ish ease)
    gsap.utils.toArray('.reveal').forEach(el => {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      });
    });

    // tool bars fill
    gsap.utils.toArray('.tools .fill').forEach(el => {
      gsap.to(el, {
        width: el.dataset.pct + '%', duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      });
    });

    // ── LIGHT → CINEMATIC DARK as we approach the immersive zone ──
    const zone = document.getElementById('zone');
    if (zone) {
      ST.create({
        trigger: zone, start: 'top 80%', end: 'top 20%', scrub: true,
        onUpdate: self => {
          // only auto-drive when user hasn't forced dark
          const v = self.progress;
          document.documentElement.setAttribute('data-theme', v > 0.5 ? 'dark' : manualTheme);
          if (window.__hero) window.__hero.setTheme(Math.max(v, manualTheme === 'dark' ? 1 : 0));
        },
      });
      // back to manual theme after leaving the dark zones (entering work)
      const work = document.getElementById('work');
      if (work) ST.create({
        trigger: work, start: 'top 70%', end: 'top 40%', scrub: true,
        onUpdate: self => {
          if (self.progress > 0.5) {
            document.documentElement.setAttribute('data-theme', manualTheme);
            if (window.__hero) window.__hero.setTheme(manualTheme === 'dark' ? 1 : 0);
          }
        },
      });

      // pinned story progress → particle tunnel + step crossfades
      const steps = gsap.utils.toArray('.zone__step');
      ST.create({
        trigger: zone, start: 'top top', end: 'bottom bottom', scrub: true,
        onUpdate: self => {
          const p = self.progress;
          if (window.__hero) window.__hero.setZone(Math.sin(Math.min(p, 1) * Math.PI)); // ramp up then down
          const seg = 1 / steps.length;
          steps.forEach((s, i) => {
            const local = (p - i * seg) / seg; // 0..1 within this step
            const vis = 1 - Math.min(Math.abs(local - 0.5) * 2, 1);
            gsap.set(s, { opacity: vis, y: (0.5 - Math.min(Math.max(local, 0), 1)) * -120, scale: 0.92 + vis * 0.12 });
          });
        },
      });
    }

    // ── MASKED VIDEO REVEAL: clip-path circle grows with scroll ──
    const rw = document.querySelector('.reveal-wrap');
    if (rw && !reduce) {
      const mask = rw.querySelector('.reveal-mask');
      gsap.fromTo(mask,
        { clipPath: 'circle(11vmax at 50% 50%)' },
        {
          clipPath: 'circle(82vmax at 50% 50%)', ease: 'none',
          scrollTrigger: { trigger: rw, start: 'top top', end: 'bottom bottom', scrub: true, pin: '.reveal-sticky' },
        });
      gsap.to(rw.querySelector('.reveal-label'), {
        scale: 1.4, opacity: 0, ease: 'none',
        scrollTrigger: { trigger: rw, start: 'top top', end: 'center center', scrub: true },
      });
    }

    // ── portfolio card parallax on hover ──
    gsap.utils.toArray('.card').forEach(card => {
      const media = card.querySelector('.card__media');
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(media, { x: x * 18, y: y * 18, duration: 0.6, ease: 'power2.out' });
      });
      card.addEventListener('pointerleave', () => gsap.to(media, { x: 0, y: 0, duration: 0.8, ease: 'power3.out' }));
    });

    // hero macro lines stagger-in
    gsap.from('.macro .row span', { yPercent: 110, duration: 1.1, ease: 'power4.out', stagger: 0.08, delay: 0.15 });
    gsap.from('.hero__eyebrow, .hero__foot', { opacity: 0, y: 24, duration: 1, ease: 'power3.out', stagger: 0.15, delay: 0.5 });

    ST.refresh();
  }

  // hero may not be ready yet; refresh once it is
  window.addEventListener('hero-ready', () => { applyTheme(manualTheme); ST.refresh(); });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
