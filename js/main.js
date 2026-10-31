/* ============================================================
   EDITORIAL MINIMAL PORTFOLIO — js/main.js
   Vanilla JS + GSAP + ScrollTrigger.
   Motion principles: duration 0.3–0.8s, power2.out / power3.out.
   One motion per element. Subtle, deliberate.
   ============================================================ */
(function () {
  'use strict';

  const hasGSAP = typeof gsap !== 'undefined';
  const hasST = typeof ScrollTrigger !== 'undefined';
  if (hasGSAP && hasST) gsap.registerPlugin(ScrollTrigger);

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;

  /* =========================================================
     A. PRELOADER — count 0→100, then fade out
     ========================================================= */
  const preloader = document.getElementById('preloader');
  const countEl = document.getElementById('preloader-count');
  let heroReady = false;

  function runPreloader(done) {
    if (!preloader) { done(); return; }

    if (prefersReduced || !hasGSAP) {
      preloader.style.display = 'none';
      done();
      return;
    }

    const obj = { v: 0 };
    gsap.to(obj, {
      v: 100,
      duration: 1.2,
      ease: 'power2.inOut',
      onUpdate: () => { if (countEl) countEl.textContent = Math.round(obj.v); },
      onComplete: () => {
        gsap.to(preloader, {
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
          onComplete: () => { preloader.style.display = 'none'; done(); }
        });
      }
    });
  }

  /* =========================================================
     B. HERO ENTRANCE — sequential timeline (after preloader)
     ========================================================= */
  function playHeroEntrance() {
    heroReady = true;
    if (!hasGSAP || prefersReduced) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('#hero .hero-eyebrow', { opacity: 0, y: 12, duration: 0.6 })
      .from('.hero-headline .line-inner', { yPercent: 110, duration: 0.8, stagger: 0.12 }, '-=0.25')
      .from('#hero .hero-desc', { opacity: 0, y: 16, duration: 0.6 }, '-=0.3')
      .from('#hero .hero-actions .btn', { opacity: 0, y: 12, duration: 0.5, stagger: 0.1 }, '-=0.2');
  }

  /* =========================================================
     C. NAV — moving indicator + magnetic
     ========================================================= */
  const navIndicator = document.getElementById('nav-indicator');
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const navInner = document.querySelector('.nav-inner');

  function moveIndicator(link) {
    if (!navIndicator || !link || isTouch) return;
    const innerRect = navInner.getBoundingClientRect();
    const r = link.getBoundingClientRect();
    const x = r.left - innerRect.left;
    gsap.to(navIndicator, {
      x: x, width: r.width, duration: 0.4, ease: 'power3.out'
    });
  }

  function setActiveNav(name) {
    navLinks.forEach(l => l.classList.toggle('active', l.dataset.nav === name));
    const active = navLinks.find(l => l.dataset.nav === name);
    if (active) moveIndicator(active);
  }

  // anchor smooth scroll + active state
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#' || !href.startsWith('#')) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
      setActiveNav(a.dataset.nav || (target.id === 'detail-view' ? 'projects' : target.id));
    });
  });

  // magnetic (desktop only)
  if (!isTouch && hasGSAP) {
    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - r.left - r.width / 2;
        const dy = e.clientY - r.top - r.height / 2;
        gsap.to(el, { x: dx * 0.3, y: dy * 0.3, duration: 0.4, ease: 'power2.out' });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
      });
    });
  }

  // active section via ScrollTrigger (desktop + !reduced)
  if (hasST && !prefersReduced) {
    ['hero', 'projects', 'contact'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      ScrollTrigger.create({
        trigger: el,
        start: 'top 55%',
        end: 'bottom 55%',
        onToggle: self => { if (self.isActive) setActiveNav(id); }
      });
    });
  }
  window.addEventListener('load', () => moveIndicator(navLinks.find(l => l.classList.contains('active')) || navLinks[0]));
  window.addEventListener('resize', () => {
    const active = navLinks.find(l => l.classList.contains('active'));
    if (active) moveIndicator(active);
  });

  /* =========================================================
     D. FILTER — fade out non-matching, then fade in matching
     ========================================================= */
  const filterBtns = Array.from(document.querySelectorAll('.filter-btn'));
  const cards = Array.from(document.querySelectorAll('.card'));

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('active')) return;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const f = btn.dataset.filter;
      const matching = cards.filter(c => f === 'all' || c.dataset.category === f);
      const nonMatching = cards.filter(c => !matching.includes(c));

      if (hasGSAP && !prefersReduced) {
        if (nonMatching.length) {
          gsap.to(nonMatching, {
            opacity: 0, y: 10, duration: 0.35, ease: 'power2.out', stagger: 0.04,
            onComplete: () => nonMatching.forEach(c => c.style.display = 'none')
          });
        }
        matching.forEach(c => c.style.display = '');
        gsap.fromTo(matching,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.06, delay: 0.1 });
      } else {
        nonMatching.forEach(c => c.style.display = 'none');
        matching.forEach(c => c.style.display = '');
      }
    });
  });

  /* =========================================================
     E. SCROLL REVEAL — cards fade + translateY (start top 85%)
     ========================================================= */
  if (hasST && !prefersReduced) {
    ScrollTrigger.batch('.card', {
      start: 'top 85%',
      onEnter: batch => gsap.from(batch, {
        opacity: 0, y: 24, duration: 0.7, ease: 'power3.out', stagger: 0.08, overwrite: true
      })
    });
  }

  /* =========================================================
     F. CARD → DETAIL VIEW transition
     ========================================================= */
  const projectsSection = document.getElementById('projects');
  const detailView = document.getElementById('detail-view');
  const detailBack = document.getElementById('detail-back');

  const dTag = document.getElementById('detail-tag');
  const dTitle = document.getElementById('detail-title');
  const dDesc = document.getElementById('detail-desc');
  const dMedia = document.getElementById('detail-media');
  const dTech = document.getElementById('detail-tech');
  const dLink = document.getElementById('detail-link');

  function openDetail(card) {
    dTag.textContent = card.dataset.category === 'mobile' ? 'Mobile' : 'Web';
    dTitle.textContent = card.dataset.title || '';
    dDesc.textContent = card.dataset.desc || '';
    dMedia.innerHTML = card.dataset.image
      ? `<img src="${card.dataset.image}" alt="${card.dataset.title || ''}">` : '';
    dTech.innerHTML = (card.dataset.tech || '').split(',').map(t =>
      `<span>${t.trim()}</span>`).join('');
    if (card.dataset.link) { dLink.href = card.dataset.link; dLink.style.display = ''; }
    else dLink.style.display = 'none';

    detailView.setAttribute('aria-hidden', 'false');

    if (hasGSAP && !prefersReduced) {
      gsap.to(projectsSection, {
        opacity: 0, y: -10, duration: 0.4, ease: 'power2.out',
        onComplete: () => {
          projectsSection.style.display = 'none';
          detailView.style.display = 'block';
          playDetailIn();
        }
      });
    } else {
      projectsSection.style.display = 'none';
      detailView.style.display = 'block';
    }
  }

  function playDetailIn() {
    if (!hasGSAP || prefersReduced) return;
    const targets = [detailBack, dTag, dTitle, dDesc, dMedia, dTech, dLink];
    gsap.from(targets, {
      opacity: 0, y: 16, duration: 0.6, ease: 'power3.out', stagger: 0.08
    });
  }

  function closeDetail() {
    detailView.setAttribute('aria-hidden', 'true');
    const finish = () => {
      detailView.style.display = 'none';
      projectsSection.style.display = 'block';
      setActiveNav('projects');
      if (hasGSAP && !prefersReduced) {
        gsap.from(projectsSection, { opacity: 0, y: 16, duration: 0.5, ease: 'power3.out' });
      }
    };
    if (hasGSAP && !prefersReduced) {
      gsap.to(detailView, { opacity: 0, duration: 0.3, ease: 'power2.out', onComplete: finish });
    } else finish();
  }

  cards.forEach(card => {
    card.addEventListener('click', () => {
      if (card.style.display === 'none') return;
      openDetail(card);
    });
  });
  if (detailBack) detailBack.addEventListener('click', closeDetail);

  /* =========================================================
     G. CUSTOM CURSOR — small dot with soft delay
     ========================================================= */
  const dot = document.getElementById('cursor-dot');
  if (dot && !isTouch && hasGSAP) {
    const xTo = gsap.quickTo(dot, 'x', { duration: 0.15, ease: 'power2.out' });
    const yTo = gsap.quickTo(dot, 'y', { duration: 0.15, ease: 'power2.out' });
    window.addEventListener('mousemove', e => { xTo(e.clientX); yTo(e.clientY); }, { passive: true });

    const hoverables = 'a, button, .card, input, textarea, .magnetic';
    document.querySelectorAll(hoverables).forEach(el => {
      el.addEventListener('mouseenter', () => gsap.to(dot, { scale: 2.6, duration: 0.25, ease: 'power2.out' }));
      el.addEventListener('mouseleave', () => gsap.to(dot, { scale: 1, duration: 0.25, ease: 'power2.out' }));
    });
  }

  /* =========================================================
     H. SCROLL PROGRESS BAR
     ========================================================= */
  const progress = document.getElementById('scroll-progress');
  if (progress) {
    if (hasGSAP) {
      const setProgress = gsap.quickSetter(progress, 'scaleX');
      const update = () => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(h > 0 ? window.scrollY / h : 0);
      };
      window.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update);
      update();
    } else {
      window.addEventListener('scroll', () => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.transform = `scaleX(${h > 0 ? window.scrollY / h : 0})`;
      }, { passive: true });
    }
  }

  /* =========================================================
     I. GUESTBOOK — Firebase
     ========================================================= */
  const firebaseConfig = {
    apiKey: "AIzaSyC9JkHeCRkgHuw5_YHhC7W5c8TpEge_OWY",
    authDomain: "cvsaya-e0996.firebaseapp.com",
    projectId: "cvsaya-e0996",
    databaseURL: "https://cvsaya-e0996-default-rtdb.asia-southeast1.firebasedatabase.app/",
    storageBucket: "cvsaya-e0996.firebasestorage.app",
    messagingSenderId: "477452657261",
    appId: "1:477452657261:web:1d349552b452422db5d564"
  };

  const commentsContainer = document.getElementById('comments-container');
  const guestbookForm = document.getElementById('guestbook-form');

  if (typeof firebase !== 'undefined' && firebaseConfig.apiKey !== "YOUR_API_KEY") {
    try {
      firebase.initializeApp(firebaseConfig);
      const database = firebase.database();
      const guestbookRef = database.ref('guestbook');

      if (guestbookForm) {
        guestbookForm.addEventListener('submit', e => {
          e.preventDefault();
          const name = document.getElementById('guest-name').value;
          const message = document.getElementById('guest-message').value;
          guestbookRef.push({
            name, message, timestamp: Date.now()
          }).then(() => guestbookForm.reset())
            .catch(err => console.error('Push failed:', err));
        });
      }

      guestbookRef.on('child_added', snapshot => {
        const data = snapshot.val();
        const initials = data.name ? data.name.charAt(0).toUpperCase() : '?';
        const el = document.createElement('div');
        el.className = 'comment';
        el.innerHTML = `
          <div class="comment-head">
            <span class="comment-avatar">${initials}</span>
            <span class="comment-name"></span>
            <span class="comment-date"></span>
          </div>
          <p class="comment-msg"></p>`;
        el.querySelector('.comment-name').textContent = data.name;
        el.querySelector('.comment-date').textContent = new Date(data.timestamp).toLocaleDateString();
        el.querySelector('.comment-msg').textContent = data.message;
        commentsContainer.prepend(el);
        if (hasGSAP && !prefersReduced) gsap.from(el, { opacity: 0, y: 10, duration: 0.5, ease: 'power3.out' });
      });
    } catch (err) {
      console.error('Firebase Error:', err);
    }
  }

  /* =========================================================
     BOOT
     ========================================================= */
  runPreloader(playHeroEntrance);

})();
