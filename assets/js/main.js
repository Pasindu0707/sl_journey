/* =====================================================================
   SL Journeys — interactions
   Vanilla JS, no dependencies. Respects prefers-reduced-motion.
   ===================================================================== */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Sticky header ---------- */
  var header = document.querySelector('.header');
  var hero = document.querySelector('.hero, .subhero');
  function onScroll() {
    if (!header) return;
    var threshold = hero ? Math.min(hero.offsetHeight - 90, window.innerHeight * 0.7) : 40;
    header.classList.toggle('is-solid', window.scrollY > threshold);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  var burger = document.querySelector('.burger');
  var mnav = document.querySelector('.mobile-nav');
  function closeNav() {
    if (!mnav) return;
    mnav.classList.remove('is-open');
    if (burger) burger.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  if (burger && mnav) {
    burger.addEventListener('click', function () {
      var open = mnav.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      if (open) {
        var links = mnav.querySelectorAll('a');
        links.forEach(function (a, i) { a.style.transitionDelay = (0.06 * i + 0.1) + 's'; });
      }
    });
    mnav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('[data-reveal],[data-stagger]');
  if (reduced || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        if (el.hasAttribute('data-stagger')) {
          var kids = el.children, step = parseFloat(el.getAttribute('data-stagger')) || 90;
          Array.prototype.forEach.call(kids, function (k, i) {
            k.style.transitionDelay = (i * step) + 'ms';
          });
        }
        el.classList.add('in');
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
    // safety: never leave content hidden if something prevents intersection
    window.addEventListener('load', function () {
      setTimeout(function () {
        revealEls.forEach(function (el) {
          var r = el.getBoundingClientRect();
          if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('in');
        });
      }, 600);
    });
  }

  /* ---------- Count-up stats ---------- */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && !reduced && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, target = parseFloat(el.getAttribute('data-count'));
        var suffix = el.getAttribute('data-suffix') || '', dur = 1500, start = null;
        function tick(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          var val = target * eased;
          el.textContent = (target % 1 === 0 ? Math.floor(val) : val.toFixed(1)) + suffix;
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = (target % 1 === 0 ? target : target.toFixed(1)) + suffix;
        }
        requestAnimationFrame(tick);
        cio.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(function (el) {
      el.textContent = el.getAttribute('data-count') + (el.getAttribute('data-suffix') || '');
    });
  }

  /* ---------- Hero parallax (subtle) ---------- */
  var pbg = document.querySelector('.hero__bg img');
  if (pbg && !reduced) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        if (y < window.innerHeight) pbg.style.transform = 'translate3d(0,' + (y * 0.18) + 'px,0) scale(1.08)';
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- Gallery lightbox ---------- */
  var lb = document.querySelector('.lightbox');
  if (lb) {
    var lbImg = lb.querySelector('img');
    var items = Array.prototype.slice.call(document.querySelectorAll('.g-item'));
    var idx = 0;
    function show(i) {
      idx = (i + items.length) % items.length;
      var src = items[idx].getAttribute('data-full') || items[idx].querySelector('img').src;
      lbImg.src = src;
      lbImg.alt = items[idx].querySelector('img').alt || '';
    }
    items.forEach(function (it, i) {
      it.addEventListener('click', function (e) {
        e.preventDefault();
        show(i); lb.classList.add('open'); document.body.style.overflow = 'hidden';
      });
    });
    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target.closest('.lb-close')) {
        lb.classList.remove('open'); document.body.style.overflow = '';
      } else if (e.target.closest('.lb-nav.next')) { show(idx + 1); }
      else if (e.target.closest('.lb-nav.prev')) { show(idx - 1); }
    });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') { lb.classList.remove('open'); document.body.style.overflow = ''; }
      if (e.key === 'ArrowRight') show(idx + 1);
      if (e.key === 'ArrowLeft') show(idx - 1);
    });
  }

  /* ---------- Enquiry / booking form -> WhatsApp + mailto ---------- */
  var WA = '94776194579';
  var EMAIL = 'info@ciaoceylontours.com';
  document.querySelectorAll('form[data-enquiry]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fd = new FormData(form), lines = [];
      var titleMap = {
        name: 'Name', email: 'Email', nationality: 'Nationality', phone: 'Phone',
        arrival: 'Arrival', departure: 'Departure', adults: 'Adults', children: 'Children',
        accommodation: 'Accommodation', meals: 'Meal basis', package: 'Tour package',
        requirement: 'Requirement', message: 'Message'
      };
      var heading = form.getAttribute('data-enquiry') || 'New enquiry';
      fd.forEach(function (val, key) {
        if (val && String(val).trim()) lines.push((titleMap[key] || key) + ': ' + val);
      });
      if (!lines.length) return;
      var body = heading + '%0A%0A' + lines.map(encodeURIComponent).join('%0A');
      var choice = form.getAttribute('data-channel');
      var waUrl = 'https://wa.me/' + WA + '?text=' + body;
      var mailUrl = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(heading) +
        '&body=' + lines.map(encodeURIComponent).join('%0D%0A');

      var msg = form.querySelector('.form-msg');
      if (msg) { msg.classList.add('show', 'ok'); msg.textContent = 'Opening WhatsApp with your enquiry — if it doesn’t open, we’ve also prepared an email draft.'; }

      if (choice === 'email') { window.location.href = mailUrl; }
      else { window.open(waUrl, '_blank'); }
      form.reset();
    });
  });

  /* ---------- Footer year ---------- */
  var yr = document.querySelector('[data-year]');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- Active nav highlight (safety net) ---------- */
  var path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.header__nav a, .mobile-nav a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === path) a.classList.add('is-active');
  });
})();
