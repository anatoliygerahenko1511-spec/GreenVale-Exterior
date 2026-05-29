/* ═══════════════════════════════════════════════════════════
   GreenVale Exterior — Shared JavaScript
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Mobile Nav Toggle ── */
  var toggle = document.querySelector('.nav-toggle');
  var mobileMenu = document.querySelector('.mobile-menu');

  if (toggle && mobileMenu) {
    toggle.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.toggle('open');
      toggle.classList.toggle('active', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!toggle.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── Scroll-Triggered Fade-In ── */
  var fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length > 0 && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    fadeEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show everything immediately
    fadeEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ── FAQ Accordion ── */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', function () {
        // Close other open items
        faqItems.forEach(function (other) {
          if (other !== item) other.classList.remove('open');
        });
        item.classList.toggle('open');
      });
    }
  });

  /* ── Modal Logic (Shop Checkout) ── */
  var modalOverlay = document.getElementById('checkoutModal');
  var modalCloseBtn = document.querySelector('.modal-close');
  var buyButtons = document.querySelectorAll('.btn-buy-gift');
  var itemInput = document.getElementById('modalItem');

  if (modalOverlay) {
    buyButtons.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var item = this.getAttribute('data-item');
        if (itemInput) itemInput.value = item;
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', function () {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── Header scroll shadow (class toggle, rAF-guarded) ── */
  var header = document.querySelector('.site-header');
  if (header) {
    var headerScrolled = false;
    var headerTicking = false;
    window.addEventListener('scroll', function () {
      if (headerTicking) return;
      headerTicking = true;
      window.requestAnimationFrame(function () {
        var shouldScroll = window.scrollY > 10;
        if (shouldScroll !== headerScrolled) {
          headerScrolled = shouldScroll;
          header.classList.toggle('scrolled', shouldScroll);
        }
        headerTicking = false;
      });
    }, { passive: true });
  }

  /* ── Hero Promo Lightbox ── */
  var promo = document.getElementById('heroPromo');
  if (promo) {
    var preview = document.getElementById('heroPromoPreview');
    var revealed = document.getElementById('heroPromoRevealed');
    var closeBtn = document.getElementById('heroPromoClose');
    var previewCloseBtn = document.getElementById('heroPromoPreviewClose');

    setTimeout(function () {
      promo.classList.add('show');
      promo.setAttribute('aria-hidden', 'false');
    }, 3000);

    var closePromo = function () {
      promo.classList.remove('show');
      promo.setAttribute('aria-hidden', 'true');
    };

    var reveal = function () {
      if (preview) preview.hidden = true;
      if (revealed) revealed.hidden = false;
    };

    if (preview) {
      preview.addEventListener('click', reveal);
      preview.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); reveal(); }
      });
    }
    if (previewCloseBtn) {
      previewCloseBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        closePromo();
      });
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', closePromo);
    }
  }

  /* ── Hero Giftcard Lightbox (Homeowners) ── */
  var giftcard = document.getElementById('heroGiftcard');
  if (giftcard) {
    var giftCloseBtn = document.getElementById('heroGiftcardClose');

    setTimeout(function () {
      giftcard.classList.add('show');
      giftcard.setAttribute('aria-hidden', 'false');
    }, 3000);

    if (giftCloseBtn) {
      giftCloseBtn.addEventListener('click', function () {
        giftcard.classList.remove('show');
        giftcard.setAttribute('aria-hidden', 'true');
      });
    }
  }

})();
