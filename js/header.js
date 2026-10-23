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
            <li><a href="/" class="nav-link">Home</a></li>

            <!-- TOOLS DROPDOWN -->
            <li class="nav-dropdown" data-dropdown="tools">
              <button
                class="nav-dropdown-toggle"
                aria-haspopup="true"
                aria-expanded="false"
                aria-controls="dropdown-tools"
              >
                Tools <span class="caret" aria-hidden="true">▾</span>
              </button>
              <div class="nav-dropdown-menu" id="dropdown-tools" role="menu">
                <a href="/#solver" role="menuitem">
                  <span class="menu-icon">🔍</span>
                  <span class="menu-text">
                    <strong>Word Search Solver</strong>
                    <small>Find hidden words in any grid</small>
                  </span>
                </a>
                <a href="/crossword-solver" role="menuitem">
                  <span class="menu-icon">✏️</span>
                  <span class="menu-text">
                    <strong>Crossword Solver</strong>
                    <small>Solve clues with letter patterns</small>
                  </span>
                </a>
                <a href="/anagram-solver" role="menuitem">
                  <span class="menu-icon">🔤</span>
                  <span class="menu-text">
                    <strong>Anagram Solver</strong>
                    <small>Unscramble letters into words</small>
                  </span>
                </a>
                <a href="/word-search-generator" role="menuitem">
                  <span class="menu-icon">🧩</span>
                  <span class="menu-text">
                    <strong>Word Search Generator</strong>
                    <small>Create custom printable puzzles</small>
                  </span>
                </a>
                <a href="/word-scramble-generator" role="menuitem">
                  <span class="menu-icon">🔀</span>
                  <span class="menu-text">
                    <strong>Word Scramble Generator</strong>
                    <small>Make jumble puzzles from words</small>
                  </span>
                </a>
                <a href="/wordle-solver" role="menuitem">
                  <span class="menu-icon">🟩</span>
                  <span class="menu-text">
                    <strong>Wordle Solver</strong>
                    <small>Find the best next 5-letter guess</small>
                  </span>
                </a>
                <a href="/word-counter" role="menuitem">
                  <span class="menu-icon">📝</span>
                  <span class="menu-text">
                    <strong>Word Counter</strong>
                    <small>Count words, characters and reading time</small>
                  </span>
                </a>
              </div>
            </li>

            <!-- GAMES DROPDOWN -->
            <li class="nav-dropdown" data-dropdown="games">
              <button
                class="nav-dropdown-toggle"
                aria-haspopup="true"
                aria-expanded="false"
                aria-controls="dropdown-games"
              >
                Games <span class="caret" aria-hidden="true">▾</span>
              </button>
              <div class="nav-dropdown-menu" id="dropdown-games" role="menu">
                <a href="/connections-unblocked" role="menuitem">
                  <span class="menu-icon">🧠</span>
                  <span class="menu-text">
                    <strong>Connections Unlimited</strong>
                    <small>Group words by hidden connections</small>
                  </span>
                </a>
                <a href="/2048-cupcakes" role="menuitem">
                  <span class="menu-icon">🧁</span>
                  <span class="menu-text">
                    <strong>2048 Cupcakes</strong>
                    <small>Merge cupcakes to reach 2048</small>
                  </span>
                </a>
                <a href="/hangman-unblocked" role="menuitem">
                  <span class="menu-icon">🪢</span>
                  <span class="menu-text">
                    <strong>Hangman Unblocked</strong>
                    <small>Guess the word before time runs out</small>
                  </span>
                </a>
                <a href="/snake-unblocked" role="menuitem">
                  <span class="menu-icon">🐍</span>
                  <span class="menu-text">
                    <strong>Snake Unblocked</strong>
                    <small>Classic snake, swipe or keyboard</small>
                  </span>
                </a>
                <a href="/minesweeper-unblocked" role="menuitem">
                  <span class="menu-icon">💣</span>
                  <span class="menu-text">
                    <strong>Minesweeper Unblocked</strong>
                    <small>Clear the board, avoid the mines</small>
                  </span>
                </a>
              </div>
            </li>

            <li><a href="/#how-it-works" class="nav-link">How It Works</a></li>
          </ul>
        </nav>

        <div class="header-actions">
          <a href="/#solver" class="btn-solve-now">Try Solver Free</a>
          <button class="hamburger" id="hamburger" aria-label="Toggle menu" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>

      <!-- MOBILE NAV -->
      <div class="mobile-nav" id="mobile-nav" aria-hidden="true">
        <div class="mobile-nav-inner">
          <ul class="mobile-nav-list">
            <li><a href="/">Home</a></li>

            <li class="mobile-nav-group">
              <button class="mobile-nav-group-toggle" aria-expanded="false" data-group="tools">
                <span>🔧 Tools</span>
                <span class="caret" aria-hidden="true">▾</span>
              </button>
              <ul class="mobile-nav-sub" hidden>
                <li><a href="/#solver">Word Search Solver</a></li>
                <li><a href="/crossword-solver">Crossword Solver</a></li>
                <li><a href="/anagram-solver">Anagram Solver</a></li>
                <li><a href="/word-search-generator">Word Search Generator</a></li>
                <li><a href="/word-scramble-generator">Word Scramble Generator</a></li>
                <li><a href="/wordle-solver">Wordle Solver</a></li>
                <li><a href="/word-counter">Word Counter</a></li>
              </ul>
            </li>

            <li class="mobile-nav-group">
              <button class="mobile-nav-group-toggle" aria-expanded="false" data-group="games">
                <span>🎮 Games</span>
                <span class="caret" aria-hidden="true">▾</span>
              </button>
              <ul class="mobile-nav-sub" hidden>
                <li><a href="/connections-unblocked">Connections Unlimited</a></li>
                <li><a href="/2048-cupcakes">2048 Cupcakes</a></li>
                <li><a href="/hangman-unblocked">Hangman Unblocked</a></li>
                <li><a href="/snake-unblocked">Snake Unblocked</a></li>
                <li><a href="/minesweeper-unblocked">Minesweeper Unblocked</a></li>
              </ul>
            </li>

            <li><a href="/#how-it-works">How It Works</a></li>
          </ul>
        </div>
      </div>
    </header>`;
  },

  init() {
    /* ---------- Elements ---------- */
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');
    const header = document.getElementById('site-header');

    /* ---------- Desktop dropdowns ---------- */
    const dropdowns = document.querySelectorAll('.nav-dropdown');

    function closeAllDropdowns(except) {
      dropdowns.forEach(dd => {
        if (dd === except) return;
        dd.classList.remove('open');
        const btn = dd.querySelector('.nav-dropdown-toggle');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
    }

    dropdowns.forEach(dd => {
      const btn = dd.querySelector('.nav-dropdown-toggle');
      if (!btn) return;

      // Toggle on click (works for touch/keyboard users)
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dd.classList.contains('open');
        if (isOpen) {
          dd.classList.remove('open');
          btn.setAttribute('aria-expanded', 'false');
        } else {
          closeAllDropdowns(dd);
          dd.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });

      // Hover to open on devices with hover capability
      if (window.matchMedia('(hover: hover)').matches) {
        dd.addEventListener('mouseenter', () => {
          closeAllDropdowns(dd);
          dd.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        });
        dd.addEventListener('mouseleave', () => {
          dd.classList.remove('open');
          btn.setAttribute('aria-expanded', 'false');
        });
      }

      // Close on Escape
      dd.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          dd.classList.remove('open');
          btn.setAttribute('aria-expanded', 'false');
          btn.focus();
        }
      });
    });

    // Click outside closes dropdowns
    document.addEventListener('click', () => closeAllDropdowns());

    /* ---------- Hamburger / mobile nav ---------- */
    hamburger?.addEventListener('click', () => {
      const expanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', !expanded);
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('open');
      mobileNav.setAttribute('aria-hidden', expanded);
      // Lock body scroll when the menu is open
      document.body.classList.toggle('mobile-nav-open', !expanded);
    });

    // Mobile group toggles (Tools / Games)
    document.querySelectorAll('.mobile-nav-group-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const group = btn.closest('.mobile-nav-group');
        const sub = group.querySelector('.mobile-nav-sub');
        const isOpen = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', !isOpen);
        group.classList.toggle('open', !isOpen);
        if (sub) sub.hidden = isOpen;
      });
    });

    // Close mobile nav on link click
    mobileNav?.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('mobile-nav-open');
      });
    });

    /* ---------- Sticky header on scroll ---------- */
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) header?.classList.add('scrolled');
      else header?.classList.remove('scrolled');
    }, { passive: true });

    /* ---------- Active nav highlight ---------- */
    // Only applies to top-level non-dropdown links (Home, How It Works)
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.main-nav > ul > li > a.nav-link');
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 120) current = section.id;
      });
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) link.classList.add('active');
      });
    }, { passive: true });
  }
};

window.Header = Header;
