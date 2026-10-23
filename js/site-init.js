/* Shared boot for tool + game pages: header/footer mount, FAQ accordion, scroll reveal. No word list needed. */
(function () {
  'use strict';
  var h = document.getElementById('header-mount');
  if (h && window.Header) { h.innerHTML = Header.render(); Header.init(); }
  var f = document.getElementById('footer-mount');
  if (f && window.Footer) { f.innerHTML = Footer.render(); Footer.init(); }

  document.querySelectorAll('.faq-question').forEach(function (q) {
    q.addEventListener('click', function () {
      var item = q.closest('.faq-item');
      var open = item.classList.toggle('open');
      q.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  var els = document.querySelectorAll('.animate-on-scroll');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  } else { els.forEach(function (el) { el.classList.add('in-view'); }); }
})();
