(function () {
  'use strict';

  var COOKIE_KEY = 'rousmur_cookie_accepted';

  /* --- cookie --- */
  var cookie = document.getElementById('cookie');
  var cookieBtn = document.getElementById('cookie-accept');

  function hideCookie(instant) {
    if (!cookie) return;
    cookie.classList.add('is-hidden');
    if (instant) cookie.hidden = true;
  }

  if (localStorage.getItem(COOKIE_KEY)) {
    hideCookie(true);
  }

  cookieBtn.addEventListener('click', function () {
    localStorage.setItem(COOKIE_KEY, '1');
    hideCookie(false);
    // после fade-out убираем из потока
    setTimeout(function () { cookie.hidden = true; }, 400);
  });

  /* --- появление блоков при скролле --- */
  var reveals = document.querySelectorAll('[data-reveal], .about');

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.15 });

    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* --- шапка при скролле --- */
  var nav = document.getElementById('nav');

  function onScroll() {
    nav.classList.toggle('is-scrolled', window.scrollY > 80);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* --- плавный скролл к брони --- */
  document.querySelectorAll('[data-book]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.getElementById('contacts');
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // фокус в первое поле после прокрутки
      setTimeout(function () {
        var first = document.getElementById('name');
        if (first) first.focus({ preventScroll: true });
      }, 600);
    });
  });

  /* --- модальное окно меню --- */
  var modal = document.getElementById('menu-modal');
  var lastFocused = null;

  function openModal() {
    lastFocused = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var btn = modal.querySelector('button');
    if (btn) btn.focus();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll('[data-open-menu]').forEach(function (btn) {
    btn.addEventListener('click', openModal);
  });

  document.querySelectorAll('[data-close-menu]').forEach(function (btn) {
    btn.addEventListener('click', closeModal);
  });

  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  /* --- форма брони ---
     shortcut: заявка только показывается на экране, бэкенда нет.
     Подключить отправку в Telegram-бот, когда появится токен. */
  var form = document.getElementById('booking-form');
  var ok = document.getElementById('form-ok');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name = form.name.value.trim();
    var phone = form.phone.value.trim().replace(/\D/g, '');

    if (name.length < 2) {
      form.name.focus();
      return;
    }
    if (phone.length < 10) {
      form.phone.focus();
      return;
    }

    ok.classList.add('is-visible');
    form.reset();
  });

  /* --- год в подвале --- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* --- дата: не раньше сегодняшней --- */
  var date = document.getElementById('date');
  if (date) {
    var today = new Date().toISOString().slice(0, 10);
    date.min = today;
    date.value = today;
  }
})();
