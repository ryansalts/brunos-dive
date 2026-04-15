// ============================================================
// main.js — Bruno's Dive Bar
// ============================================================

(function () {
  'use strict';

  // ---- Scroll Reveal ----
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    els.forEach(function (el) { io.observe(el); });
  }

  // ---- Sticky header shadow ----
  function initHeader() {
    var header = document.getElementById('site-header');
    if (!header) return;
    window.addEventListener('scroll', function () {
      header.style.boxShadow = window.scrollY > 10
        ? '0 2px 30px rgba(0,0,0,0.8)'
        : 'none';
    }, { passive: true });
  }

  // ---- Mobile drawer ----
  function initDrawer() {
    var hamburger = document.querySelector('.hamburger');
    var drawer    = document.querySelector('.mobile-drawer');
    var overlay   = document.querySelector('.drawer-overlay');
    var closeBtn  = document.querySelector('.drawer-close');
    var drawerLinks = drawer ? drawer.querySelectorAll('a') : [];

    if (!hamburger || !drawer) return;

    function openDrawer() {
      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
      overlay.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      overlay.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);
    drawerLinks.forEach(function (a) {
      a.addEventListener('click', closeDrawer);
    });
  }

  // ---- Smooth scroll for anchor links ----
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = this.getAttribute('href');
        if (id === '#') return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        var headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 64;
        var top = target.getBoundingClientRect().top + window.scrollY - headerH - 8;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  // ---- Init ----
  document.addEventListener('DOMContentLoaded', function () {
    initReveal();
    initHeader();
    initDrawer();
    initSmoothScroll();
  });

})();
