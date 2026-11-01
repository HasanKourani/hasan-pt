(() => {
  'use strict';

  /* ---------------- The business ---------------- */
  // Facts from the owner (brief.md). Prices are not here: they come from the page, which the
  // build fills from PRICES in build.mjs, so there is one place to change them.

  const BUSINESS = {
    name: 'Hasan Kourani',
    whatsapp: '96170089237', // international format, digits only
  };

  /* ---------------- WhatsApp messages ---------------- */
  // The ready-made messages visitors pick from in the booking section.

  const UI = {
    wa: { default: `Hi Hasan! 👋 I found your website and I'd like to ask about coaching.` },
    goal: {
      fat: 'lose fat', muscle: 'build muscle', strength: 'get stronger',
      start: 'get started from zero', unsure: "not sure yet, I'd like your help choosing",
    },
    when: { week: 'this week', month: 'this month', looking: "soon, I'm still looking around" },
    msg: {
      free: (g, w) => `Hi Hasan! 👋\nI'd like to book a free consultation.\nMy goal: ${g}.\nI'd like to start ${w}.`,
      online: (g, w, p) => `Hi Hasan! 👋\nI'm interested in Online Coaching (${p} a month).\nMy goal: ${g}.\nI'd like to start ${w}. How do we begin?`,
      one: (g, w) => `Hi Hasan! 👋\nI'm interested in 1-on-1 Training.\nMy goal: ${g}.\nCan we agree on the price, gym and times? I'd like to start ${w}.`,
      plan: (g, w, p) => `Hi Hasan! 👋\nI'd like a Custom Plan (${p}).\nMy goal: ${g}.\nWhat do you need from me to get started?`,
      question: () => `Hi Hasan! 👋\nI have a question about your coaching:\n`,
    },
  };

  const root = document.documentElement;
  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const waLink = (text) => `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(text)}`;

  /* ---------------- WhatsApp links ---------------- */

  function renderWhatsApp() {
    $$('[data-wa]').forEach((a) => {
      a.href = waLink(UI.wa[a.dataset.wa] || UI.wa.default);
      a.target = '_blank';
      a.rel = 'noopener';
    });
  }

  /* ---------------- Navigation, progress, booking dock ---------------- */

  const nav = document.getElementById('nav');
  const menuBtn = document.getElementById('nav-menu');
  const hero = $('.hero');
  const dock = document.getElementById('dock');
  const book = document.getElementById('book');
  const footer = $('.footer');

  function setMenu(open) {
    nav.classList.toggle('nav--open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
  }
  menuBtn.addEventListener('click', () => setMenu(!nav.classList.contains('nav--open')));
  $$('#nav-links a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('nav--open')) { setMenu(false); menuBtn.focus(); }
  });
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('nav--open') && !nav.contains(e.target)) setMenu(false);
  });

  let lastY = window.scrollY;
  function renderNav() {
    const y = window.scrollY;
    const heroBottom = hero.getBoundingClientRect().bottom;
    nav.classList.toggle('nav--solid', heroBottom <= nav.offsetHeight + 24);
    // On the way down the pill slides away; any scroll up brings it back
    if (Math.abs(y - lastY) > 6) {
      nav.classList.toggle('nav--hidden', y > lastY && heroBottom < 0);
      lastY = y;
    }
    const max = root.scrollHeight - window.innerHeight;
    $('#progress')?.style.setProperty('--progress', (max > 0 ? clamp(y / max) : 0).toFixed(4));

    const b = book.getBoundingClientRect();
    const f = footer.getBoundingClientRect();
    const nearEnd = b.top < window.innerHeight * 0.85 || f.top < window.innerHeight;
    dock.classList.toggle('is-on', heroBottom < 60 && !nearEnd);
  }

  /* ---------------- Hero: the headline lifts away on desktop scroll ---------------- */

  const scrubQuery = window.matchMedia('(min-width: 900px) and (pointer: fine)');
  function renderHero() {
    const on = scrubQuery.matches;
    hero.classList.toggle('is-scrubbing', on);
    if (!on) return;
    const h = hero.offsetHeight;
    hero.style.setProperty('--hp', clamp(window.scrollY / (h * 0.85)).toFixed(4));
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { renderNav(); renderHero(); ticking = false; });
  }, { passive: true });
  window.addEventListener('resize', () => { renderNav(); renderHero(); flow.layout(); });

  /* ---------------- Reveals ---------------- */
  // [data-reveal] gets .is-in once it scrolls into view; its [data-reveal-item] children get a
  // --d index for staggered delays. Tall blocks also count once they fill a third of the screen.

  const onReveal = new Map();
  const io = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const fills = entry.rootBounds && entry.intersectionRect.height > entry.rootBounds.height / 3;
        if (entry.isIntersecting && (entry.intersectionRatio >= 0.2 || fills)) reveal(entry.target);
      });
    }, { threshold: [0, 0.05, 0.1, 0.15, 0.2], rootMargin: '0px 0px -8% 0px' })
    : null;

  function reveal(el) {
    el.classList.add('is-in');
    io?.unobserve(el);
    onReveal.get(el)?.();
  }
  function watch(selector, run) {
    $$(selector).forEach((el) => {
      $$('[data-reveal-item]', el).forEach((item, i) => item.style.setProperty('--d', i));
      if (run) onReveal.set(el, run);
      if (io) io.observe(el); else reveal(el);
    });
  }

  function countUp(el, to, duration = 1100) {
    const start = performance.now();
    const step = (now) => {
      const k = clamp((now - start) / duration);
      el.textContent = String(Math.round(to * (1 - Math.pow(1 - k, 3))));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // The statement lights up word by word once it is on screen
  function splitWords(el) {
    if (!el) return;
    let i = 0;
    const walk = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === 3) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            const s = document.createElement('span');
            s.className = 'wd';
            s.style.setProperty('--w', i++);
            s.textContent = part;
            frag.appendChild(s);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1) walk(child);
      });
    };
    walk(el);
  }

  /* ---------------- Programs: tabs, auto-advance, circle reveal ---------------- */

  const programs = (() => {
    const stage = document.getElementById('stage');
    if (!stage) return {};
    const tabs = $$('.tab', stage);
    const panels = $$('.panel', stage);
    const imgs = $$('.stage__img', stage);
    const media = $('.stage__media', stage);
    const ids = tabs.map((t) => t.dataset.prog);
    const DUR = 7000;
    let current = ids[0];
    let auto = true;
    let visible = false;
    let timer = null;
    let imgTimer = null;
    stage.style.setProperty('--dur', `${DUR}ms`);

    function select(id, origin) {
      if (id === current) return;
      const r = media.getBoundingClientRect();
      const o = (origin || tabs[ids.indexOf(id)]).getBoundingClientRect();
      const cx = clamp((o.left + o.width / 2 - r.left) / r.width, -0.2, 1.2) * 100;
      const cy = clamp((o.top + o.height / 2 - r.top) / r.height, -0.2, 1.2) * 100;
      // finish any reveal still running, then open the next photo from the tab's position
      imgs.forEach((im) => { if (im.classList.contains('is-entering')) { im.classList.remove('is-entering'); im.classList.add('is-active'); } });
      const next = imgs.find((im) => im.dataset.prog === id);
      next.style.setProperty('--cx', `${cx.toFixed(1)}%`);
      next.style.setProperty('--cy', `${cy.toFixed(1)}%`);
      void next.offsetWidth;
      next.classList.add('is-entering');
      clearTimeout(imgTimer);
      imgTimer = setTimeout(() => {
        imgs.forEach((im) => im.classList.toggle('is-active', im === next));
        next.classList.remove('is-entering');
      }, 1000);

      panels.forEach((p) => {
        const on = p.dataset.prog === id;
        p.classList.toggle('is-active', on);
        p.hidden = !on;
      });
      tabs.forEach((t) => {
        const on = t.dataset.prog === id;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
      });
      current = id;
      schedule();
    }

    function step(dir) { select(ids[(ids.indexOf(current) + dir + ids.length) % ids.length]); }

    // Auto-advance like a story, with a timer bar on the active tab, until someone takes over
    function schedule() {
      clearTimeout(timer);
      stage.classList.remove('is-timing');
      if (!auto || !visible || document.hidden) return;
      void stage.offsetWidth;
      stage.classList.add('is-timing');
      timer = setTimeout(() => step(1), DUR);
    }
    function stop() { auto = false; schedule(); }

    tabs.forEach((t) => t.addEventListener('click', () => { stop(); select(t.dataset.prog, t); }));
    stage.addEventListener('keydown', (e) => {
      if (!e.target.matches('.tab')) return;
      let to = null;
      if (e.key === 'ArrowRight') to = (ids.indexOf(current) + 1) % ids.length;
      else if (e.key === 'ArrowLeft') to = (ids.indexOf(current) - 1 + ids.length) % ids.length;
      else if (e.key === 'Home') to = 0;
      else if (e.key === 'End') to = ids.length - 1;
      if (to === null) return;
      e.preventDefault();
      stop();
      select(ids[to]);
      tabs[to].focus();
    });

    // Swipe the stage sideways to change program on phones
    let sx = null, sy = null;
    stage.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') { sx = e.clientX; sy = e.clientY; } });
    stage.addEventListener('pointerup', (e) => {
      if (sx === null) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      sx = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) { stop(); step(dx < 0 ? 1 : -1); }
    });
    stage.addEventListener('pointercancel', () => { sx = null; });
    stage.addEventListener('mouseenter', () => { clearTimeout(timer); stage.classList.remove('is-timing'); });
    stage.addEventListener('mouseleave', schedule);
    document.addEventListener('visibilitychange', schedule);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; schedule(); }, { threshold: 0.45 }).observe(stage);
    }
    return { select: (id) => { stop(); select(id); } };
  })();

  /* ---------------- Method: tap the dumbbell to put it back together ---------------- */

  const bell = document.getElementById('bell');
  bell?.addEventListener('click', () => { if (bell.classList.contains('is-in')) bell.classList.toggle('is-together'); });

  /* ---------------- Gallery: cover-flow ---------------- */

  const flow = (() => {
    const el = document.getElementById('flow');
    if (!el) return { layout() {} };
    const cards = $$('.flow__card', el);
    const count = document.getElementById('flow-count');
    const n = cards.length;
    let pos = 0;           // the card in the middle (fractional while dragging)
    let drag = null;
    const pad = (v) => String(v).padStart(2, '0');

    function layout() {
      const cw = cards[0].offsetWidth || 300;
      const phone = window.innerWidth < 700;
      const gap = cw * (phone ? 0.56 : 0.66);
      cards.forEach((c, i) => {
        let o = i - pos;
        if (o > n / 2) o -= n;
        if (o < -n / 2) o += n;
        const a = Math.abs(o);
        const rot = clamp(o, -1, 1) * (phone ? 28 : 36);
        c.style.transform = `translateX(${(o * gap).toFixed(1)}px) translateZ(${(-Math.min(a, 3) * 230).toFixed(1)}px) rotateY(${(-rot).toFixed(1)}deg)`;
        c.style.zIndex = String(100 - Math.round(a * 10));
        c.style.opacity = a > 2.6 ? '0' : '1';
        c.style.filter = `brightness(${(1 - Math.min(a, 2) * 0.28).toFixed(2)})`;
        const active = Math.round(a * 100) === 0;
        c.classList.toggle('is-active', active);
        c.tabIndex = active ? 0 : -1;
        c.setAttribute('aria-hidden', String(a > 1.5));
      });
      const idx = ((Math.round(pos) % n) + n) % n;
      count.textContent = `${pad(idx + 1)} / ${pad(n)}`;
    }
    function go(to) { pos = Math.round(to); layout(); }

    document.getElementById('flow-prev').addEventListener('click', () => go(pos - 1));
    document.getElementById('flow-next').addEventListener('click', () => go(pos + 1));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') go(pos + 1);
      if (e.key === 'ArrowLeft') go(pos - 1);
    });

    el.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.flow__btn')) return;
      drag = { x: e.clientX, y: e.clientY, start: pos, moved: false, id: e.pointerId };
    });
    el.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(e.clientY - drag.y)) {
        drag.moved = true;
        el.classList.add('is-dragging');
        el.setPointerCapture?.(drag.id);
      }
      if (!drag.moved) return;
      const cw = cards[0].offsetWidth || 300;
      pos = drag.start - dx / (cw * 0.8);
      layout();
    });
    const end = (e) => {
      if (!drag) return;
      const wasDrag = drag.moved;
      drag = null;
      el.classList.remove('is-dragging');
      if (wasDrag) { go(pos); return; }
      const card = e.target.closest?.('.flow__card');
      if (!card) return;
      const i = cards.indexOf(card);
      if (card.classList.contains('is-active')) openLightbox(card);
      else {
        // move the shortest way round to the tapped card
        let o = i - (((Math.round(pos) % n) + n) % n);
        if (o > n / 2) o -= n;
        if (o < -n / 2) o += n;
        go(Math.round(pos) + o);
      }
    };
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', () => { drag = null; el.classList.remove('is-dragging'); go(pos); });
    // keyboard "click" on the active card
    cards.forEach((c) => c.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(c); } }));

    return { layout };
  })();

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  function openLightbox(card) {
    const img = $('img', card);
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt;
    if (lightbox.showModal) lightbox.showModal(); else lightbox.setAttribute('open', '');
  }
  document.getElementById('lightbox-close').addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.close(); });

  /* ---------------- Founding pass: tilts toward the mouse, flips on tap ---------------- */

  const pass = document.getElementById('pass');
  if (pass) {
    pass.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const r = pass.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      pass.style.setProperty('--ry', `${((px - 0.5) * 18).toFixed(2)}deg`);
      pass.style.setProperty('--rx', `${((0.5 - py) * 14).toFixed(2)}deg`);
      pass.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`);
      pass.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`);
    });
    pass.addEventListener('pointerleave', () => { ['--rx', '--ry', '--gx', '--gy'].forEach((p) => pass.style.removeProperty(p)); });
    pass.addEventListener('click', () => {
      const flipped = pass.classList.toggle('is-flipped');
      pass.setAttribute('aria-pressed', String(flipped));
    });
  }

  /* ---------------- FAQ: answers slide open ---------------- */

  $$('.qa').forEach((d) => {
    const summary = $('summary', d);
    const answer = $('.qa__a', d);
    let anim = null;
    summary.addEventListener('click', (e) => {
      if (!answer.animate) return;
      e.preventDefault();
      anim?.cancel();
      const easing = 'cubic-bezier(0.2, 0.8, 0.2, 1)';
      if (d.open) {
        anim = answer.animate([{ height: `${answer.offsetHeight}px`, opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 320, easing });
        anim.onfinish = () => { d.open = false; anim = null; };
      } else {
        d.open = true;
        anim = answer.animate([{ height: '0px', opacity: 0 }, { height: `${answer.offsetHeight}px`, opacity: 1 }], { duration: 420, easing });
        anim.onfinish = () => { anim = null; };
      }
    });
  });

  /* ---------------- Book: WhatsApp composer with ready messages ---------------- */

  const composer = (() => {
    const form = document.getElementById('composer');
    if (!form) return { render() {} };
    const bubble = document.getElementById('bubble');
    const text = document.getElementById('bubble-text');
    const typing = document.getElementById('typing');
    const send = document.getElementById('wa-send');
    const priceOf = (id) => $(`.panel[data-prog="${id}"]`)?.dataset.price || '';
    let typeTimer = null;
    let message = '';

    function build() {
      const f = new FormData(form);
      const topic = f.get('topic') || 'free';
      const u = UI;
      const tpl = u.msg[topic] || u.msg.free;
      return { topic, text: tpl(u.goal[f.get('goal')] || u.goal.fat, u.when[f.get('when')] || u.when.week, priceOf(topic)) };
    }

    // instant: no typing animation (first render, language change)
    function render(instant) {
      const m = build();
      message = m.text;
      const off = m.topic === 'question';
      ['pick-goal', 'pick-when'].forEach((id) => {
        const fs = document.getElementById(id);
        fs.classList.toggle('is-off', off);
        fs.disabled = off;
      });
      send.href = waLink(message);
      send.target = '_blank';
      send.rel = 'noopener';

      clearInterval(typeTimer);
      if (instant) {
        typing.classList.remove('is-on');
        bubble.classList.remove('is-hidden');
        text.textContent = message;
        return;
      }
      // typing dots, then the message types itself out
      bubble.classList.add('is-hidden');
      typing.classList.add('is-on');
      clearTimeout(render.t);
      render.t = setTimeout(() => {
        typing.classList.remove('is-on');
        bubble.classList.remove('is-hidden', 'is-new');
        void bubble.offsetWidth;
        bubble.classList.add('is-new');
        const chars = [...message];
        const per = Math.max(1, Math.ceil(chars.length / 45));
        let i = 0;
        text.textContent = '';
        typeTimer = setInterval(() => {
          i = Math.min(chars.length, i + per);
          text.textContent = chars.slice(0, i).join('');
          if (i >= chars.length) clearInterval(typeTimer);
        }, 16);
      }, 520);
    }

    form.addEventListener('change', () => render(false));
    form.addEventListener('submit', (e) => e.preventDefault());
    send.addEventListener('click', () => {
      clearInterval(typeTimer);
      text.textContent = message;
      bubble.classList.remove('is-sent');
      void bubble.offsetWidth;
      bubble.classList.add('is-sent');
    });

    // "Ask about this" buttons arrive with their program already picked
    $$('[data-pick]').forEach((a) => a.addEventListener('click', () => {
      const input = form.querySelector(`input[name="topic"][value="${a.dataset.pick}"]`);
      if (input && !input.checked) { input.checked = true; render(false); }
    }));

    return { render };
  })();

  /* ---------------- Small details ---------------- */

  // Buttons lean toward the mouse a little
  $$('[data-magnetic]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mgx', `${((e.clientX - (r.left + r.width / 2)) * 0.2).toFixed(1)}px`);
      el.style.setProperty('--mgy', `${((e.clientY - (r.top + r.height / 2)) * 0.3).toFixed(1)}px`);
    });
    el.addEventListener('pointerleave', () => { el.style.removeProperty('--mgx'); el.style.removeProperty('--mgy'); });
  });

  // A ring follows the mouse with a little lag and swells over anything you can press
  const cursor = document.getElementById('cursor');
  if (cursor) {
    const ring = $('.cursor__ring', cursor);
    const dot = $('.cursor__dot', cursor);
    let cx = 0, cy = 0, rx = 0, ry = 0, frame = null, seen = false;
    const loop = () => {
      rx += (cx - rx) * 0.2;
      ry += (cy - ry) * 0.2;
      ring.style.transform = `translate(${rx.toFixed(1)}px, ${ry.toFixed(1)}px)`;
      frame = Math.abs(cx - rx) + Math.abs(cy - ry) > 0.2 ? requestAnimationFrame(loop) : null;
    };
    document.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      root.classList.add('has-mouse');
      cx = e.clientX; cy = e.clientY;
      if (!seen) { rx = cx; ry = cy; seen = true; }
      dot.style.transform = `translate(${cx}px, ${cy}px)`;
      cursor.classList.remove('is-out');
      cursor.classList.toggle('is-hover', Boolean(e.target.closest?.('a, button, label, summary, .bell')));
      if (!frame) frame = requestAnimationFrame(loop);
    }, { passive: true });
    root.addEventListener('mouseleave', () => cursor.classList.add('is-out'));
  }

  // The footer wordmark is split into letters so they can wave on hover
  const footerWord = document.getElementById('footer-word');
  if (footerWord) {
    const word = footerWord.textContent;
    footerWord.textContent = '';
    [...word].forEach((ch, i) => {
      const l = document.createElement('span');
      l.className = 'l';
      l.style.setProperty('--i', i);
      l.textContent = ch;
      footerWord.appendChild(l);
    });
  }

  /* ---------------- Start ---------------- */

  splitWords($('.honest__statement'));
  renderWhatsApp();
  composer.render(true);
  flow.layout();
  renderNav();
  renderHero();

  // Counters start from zero when they come into view
  const counters = $$('[data-count]');
  counters.forEach((c) => { c.textContent = '0'; });
  watch('#stats', () => counters.forEach((c) => countUp(c, Number(c.dataset.count))));
  watch('.honest__statement', () => setTimeout(() => $('.honest__statement').classList.add('is-lit'), 250));
  watch('[data-reveal]');
  void programs;
})();
