/* ============================================================
   WLIS – Weekend London Islamic School
   script.js
   ============================================================ */

'use strict';

/* ============================================================
   1. NAVBAR: Sticky shadow & active link highlight on scroll
   ============================================================ */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main section[id]');

  if (!navbar) return;

  /* Add scrolled class for shadow enhancement */
  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
    highlightActiveLink();
  }

  /* Highlight the nav link whose section is currently in view */
  function highlightActiveLink() {
    const scrollMid = window.scrollY + window.innerHeight / 3;

    let currentId = '';
    sections.forEach(section => {
      if (section.offsetTop <= scrollMid) {
        currentId = section.id;
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${currentId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();


/* ============================================================
   2. HAMBURGER MENU: Toggle mobile navigation
   ============================================================ */
(function initHamburger() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');

  if (!hamburger || !mobileMenu) return;

  function openMenu() {
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = '';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    const isOpen = hamburger.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  }

  hamburger.addEventListener('click', toggleMenu);

  /* Close menu when a nav link is clicked */
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* Close menu on Escape key */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && hamburger.classList.contains('open')) {
      closeMenu();
      hamburger.focus();
    }
  });

  /* Close menu if viewport resizes back to desktop */
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeMenu();
    }
  });
})();


/* ============================================================
   3. FEE SCHEDULE TABS: Toggle between Monthly and Full payment
   ============================================================ */
(function initFeeTabs() {
  const tabs   = document.querySelectorAll('.fees__tab');
  const panels = document.querySelectorAll('.fees__panel');

  if (!tabs.length || !panels.length) return;

  function activateTab(selectedTab) {
    const targetId = selectedTab.getAttribute('aria-controls');

    /* Update tabs */
    tabs.forEach(tab => {
      const isSelected = tab === selectedTab;
      tab.classList.toggle('fees__tab--active', isSelected);
      tab.setAttribute('aria-selected', isSelected.toString());
    });

    /* Update panels */
    panels.forEach(panel => {
      const isActive = panel.id === targetId;
      panel.classList.toggle('fees__panel--active', isActive);
      panel.setAttribute('aria-hidden', (!isActive).toString());
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => activateTab(tab));

    /* Keyboard navigation: arrow keys between tabs */
    tab.addEventListener('keydown', e => {
      const tabList  = Array.from(tabs);
      const index    = tabList.indexOf(tab);
      let nextIndex  = index;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        nextIndex = (index + 1) % tabList.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        nextIndex = (index - 1 + tabList.length) % tabList.length;
      } else if (e.key === 'Home') {
        nextIndex = 0;
      } else if (e.key === 'End') {
        nextIndex = tabList.length - 1;
      } else {
        return;
      }

      e.preventDefault();
      tabList[nextIndex].focus();
      activateTab(tabList[nextIndex]);
    });
  });
})();


/* ============================================================
   4. SMOOTH SCROLL: Polyfill for browsers that don't support
      scroll-behavior: smooth natively (and handle anchor clicks)
   ============================================================ */
(function initSmoothScroll() {
  const navbarHeight = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--navbar-height') || '72',
    10
  );

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const targetTop = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });

      /* Update focus for accessibility */
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });
})();


/* ============================================================
   5. INTERSECTION OBSERVER: Fade-in cards on scroll entry
   ============================================================ */
(function initScrollAnimations() {
  /* Only animate if user has no reduced-motion preference */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const animatables = document.querySelectorAll(
    '.about-card, .location-card, .cta-box, .fees__notice'
  );

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  animatables.forEach(el => {
    /* Set initial hidden state via JS so it only applies when JS is available */
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
})();
