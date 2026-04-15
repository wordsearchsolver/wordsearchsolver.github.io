const Footer = {
  render() {
    const year = new Date().getFullYear();
    return `
    <footer class="site-footer" id="site-footer">
      <div class="footer-glow"></div>
      <div class="footer-inner">
        <div class="footer-top">
          <div class="footer-brand">
            <a href="/" class="logo footer-logo" aria-label="WordSearch Solver Home">
              <div class="logo-icon"><span>W</span><span>S</span></div>
              <div class="logo-text">
                <span class="logo-main">WordSearch</span>
                <span class="logo-sub">Solver</span>
              </div>
            </a>
            <p class="footer-tagline">The smartest, fastest way to solve any word search puzzle. Free, instant, and educational.</p>
            <div class="footer-badges">
              <span class="badge">🆓 Free</span>
              <span class="badge">⚡ Instant</span>
              <span class="badge">📱 Mobile Ready</span>
            </div>
          </div>

          <div class="footer-links-grid">
            <div class="footer-col">
              <h4>Tool</h4>
              <ul>
                <li><a href="#solver">Word Search Solver</a></li>
                <li><a href="#how-it-works">How It Works</a></li>
                <li><a href="#features">Features</a></li>
                <li><a href="#solver">Try the Solver</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <h4>Learn</h4>
              <ul>
                <li><a href="#tips">Tips & Tricks</a></li>
                <li><a href="#directions">Search Directions</a></li>
                <li><a href="#about">About Word Searches</a></li>
                <li><a href="#faq">FAQ</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <h4>Pages</h4>
              <ul>
                <li><a href="privacy">Privacy Policy</a></li>
                <li><a href="terms">Terms of Use</a></li>
                <li><a href="about">About</a></li>
                <li><a href="contact">Contact</a></li>
                <li><a href="disclaimer">Disclaimer</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div class="footer-divider"></div>

        <div class="footer-bottom">
          <p class="copyright">&copy; ${year} WordSearch Solver — wordsearchsolver.github.io. All rights reserved.</p>
          <p class="footer-disclaimer">This tool is provided free of charge for educational and entertainment purposes. No account required.</p>
        </div>
      </div>
    </footer>`;
  },

  init() {
    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }
};

window.Footer = Footer;
