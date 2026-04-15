const Header = {
  render() {
    return `
    <header class="site-header" id="site-header">
      <div class="header-inner">
        <a href="/" class="logo" aria-label="WordSearch Solver Home">
          <div class="logo-icon">
            <span>W</span><span>S</span>
          </div>
          <div class="logo-text">
            <span class="logo-main">WordSearch</span>
            <span class="logo-sub">Solver</span>
          </div>
        </a>
        <nav class="main-nav" id="main-nav" role="navigation" aria-label="Main navigation">
          <ul>
            <li><a href="#solver">Solver</a></li>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#tips">Tips & Tricks</a></li>
            <li><a href="#faq">FAQ</a></li>
          </ul>
        </nav>
        <div class="header-actions">
          <a href="#solver" class="btn-solve-now">Try Solver Free</a>
          <button class="hamburger" id="hamburger" aria-label="Toggle menu" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
      <div class="mobile-nav" id="mobile-nav" aria-hidden="true">
        <ul>
          <li><a href="#solver">Solver</a></li>
          <li><a href="#how-it-works">How It Works</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#tips">Tips & Tricks</a></li>
          <li><a href="#faq">FAQ</a></li>
        </ul>
      </div>
    </header>`;
  },

  init() {
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');
    const header = document.getElementById('site-header');

    hamburger?.addEventListener('click', () => {
      const expanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', !expanded);
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('open');
      mobileNav.setAttribute('aria-hidden', expanded);
    });

    // Close mobile nav on link click
    mobileNav?.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
      });
    });

    // Sticky header on scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        header?.classList.add('scrolled');
      } else {
        header?.classList.remove('scrolled');
      }
    });

    // Active nav highlight
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.main-nav a');
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 120) current = section.id;
      });
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) link.classList.add('active');
      });
    });
  }
};

window.Header = Header;
