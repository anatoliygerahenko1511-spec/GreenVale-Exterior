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
          // Stagger children within the same parent
          var parent = entry.target.parentElement;
          var siblings = parent ? parent.querySelectorAll('.fade-in') : [];
          var index = Array.from(siblings).indexOf(entry.target);
          var delay = Math.min(index, 8) * 80;

          setTimeout(function () {
            entry.target.classList.add('visible');
          }, delay);

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

  /* ── Header scroll shadow ── */
  var header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 10) {
        header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
      } else {
        header.style.boxShadow = '0 1px 6px rgba(0,0,0,0.06)';
      }
    }, { passive: true });
  }

  /* ── Hero parallax on scroll ── */
  var heroContent = document.querySelector('.hero-content');
  var heroSection = document.querySelector('.hero');
  if (heroContent && heroSection) {
    window.addEventListener('scroll', function () {
      var scrollY = window.scrollY;
      var heroH = heroSection.offsetHeight;
      if (scrollY < heroH) {
        heroContent.style.transform = 'translateY(' + (scrollY * 0.3) + 'px)';
        heroContent.style.opacity = Math.max(1 - scrollY / 800, 0);
      }
    }, { passive: true });
  }

  /* ── Canada Banner parallax on scroll ── */
  var bannerContent = document.querySelector('.canada-banner .banner-content');
  var bannerSection = document.querySelector('.canada-banner');
  if (bannerContent && bannerSection) {
    window.addEventListener('scroll', function () {
      var rect = bannerSection.getBoundingClientRect();
      var winH = window.innerHeight;
      if (rect.top < winH && rect.bottom > 0) {
        var offset = winH - rect.top;
        bannerContent.style.transform = 'translateY(' + (offset * -0.08) + 'px)';
      }
    }, { passive: true });
  }

  /* ── Hero Promo Lightbox ── */
  var promo = document.getElementById('heroPromo');
  if (promo) {
    var preview = document.getElementById('heroPromoPreview');
    var revealed = document.getElementById('heroPromoRevealed');
    var closeBtn = document.getElementById('heroPromoClose');
    var STORAGE_KEY = 'gv_promo_wash18s_seen';

    var alreadySeen = false;
    try { alreadySeen = localStorage.getItem(STORAGE_KEY) === '1'; } catch (e) {}

    if (!alreadySeen) {
      setTimeout(function () {
        promo.classList.add('show');
        promo.setAttribute('aria-hidden', 'false');
      }, 3000);

      var reveal = function () {
        if (preview) preview.hidden = true;
        if (revealed) revealed.hidden = false;
        try { localStorage.setItem(STORAGE_KEY, '1'); } catch (e) {}
      };

      if (preview) {
        preview.addEventListener('click', reveal);
        preview.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); reveal(); }
        });
      }
      if (closeBtn) {
        closeBtn.addEventListener('click', function () {
          promo.classList.remove('show');
          promo.setAttribute('aria-hidden', 'true');
          try { localStorage.setItem(STORAGE_KEY, '1'); } catch (e) {}
        });
      }
    }
  }

  /* ── Hero Giftcard Lightbox (Homeowners) ── */
  var giftcard = document.getElementById('heroGiftcard');
  if (giftcard) {
    var giftCloseBtn = document.getElementById('heroGiftcardClose');
    var GC_KEY = 'gv_giftcard_invite_seen';

    var gcSeen = false;
    try { gcSeen = localStorage.getItem(GC_KEY) === '1'; } catch (e) {}

    if (!gcSeen) {
      setTimeout(function () {
        giftcard.classList.add('show');
        giftcard.setAttribute('aria-hidden', 'false');
      }, 3000);

      if (giftCloseBtn) {
        giftCloseBtn.addEventListener('click', function () {
          giftcard.classList.remove('show');
          giftcard.setAttribute('aria-hidden', 'true');
          try { localStorage.setItem(GC_KEY, '1'); } catch (e) {}
        });
      }
    }
  }

})();
