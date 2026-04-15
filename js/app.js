const WORD_COLORS = [
  '#e63946','#f4a261','#2a9d8f','#457b9d','#9c27b0',
  '#ff6b35','#06a77d','#e76f51','#3a86ff','#fb5607',
  '#8338ec','#3d405b','#e9c46a','#264653','#d62828',
  '#023e8a','#7b2d8b','#c77dff','#48cae4','#f72585',
];

const SolverUI = {
  solveBtnEl: null,
  clearBtnEl: null,
  gridInput: null,
  wordsInput: null,
  resultsSection: null,
  sampleLoaded: false,

  SAMPLE_GRID: `A N I M A L S F R T
C A T S O O G B R U
D O G E F O X H I R
B E A R W O L F J T
L I O N X E P Z K L
T I G E R Q R A M E
E L E P H A N T S D
M O N K E Y B A T S
H O R S E C O W H I
S H A R K W H A L E`,

  SAMPLE_WORDS: `CAT\nDOG\nFOX\nBEAR\nLION\nTIGER\nELEPHANT\nMONKEY\nHORSE\nSHARK`,

  init() {
    this.solveBtnEl = document.getElementById('solve-btn');
    this.clearBtnEl = document.getElementById('clear-btn');
    this.gridInput = document.getElementById('grid-input');
    this.wordsInput = document.getElementById('words-input');
    this.resultsSection = document.getElementById('results-section');

    document.getElementById('sample-btn')?.addEventListener('click', () => this.loadSample());
    this.solveBtnEl?.addEventListener('click', () => this.solve());
    this.clearBtnEl?.addEventListener('click', () => this.clear());

    document.getElementById('copy-results-btn')?.addEventListener('click', () => this.copyResults());

    // Grid paste auto-format
    this.gridInput?.addEventListener('input', () => this.updateGridInfo());

    this.updateGridInfo();
  },

  loadSample() {
    this.gridInput.value = this.SAMPLE_GRID;
    this.wordsInput.value = this.SAMPLE_WORDS;
    this.updateGridInfo();
    this.gridInput.classList.add('pulse-once');
    setTimeout(() => this.gridInput.classList.remove('pulse-once'), 600);
  },

  updateGridInfo() {
    const val = this.gridInput?.value.trim();
    if (!val) {
      document.getElementById('grid-info').textContent = '';
      return;
    }
    const grid = WordSearchEngine.parseGrid(val);
    if (grid.length > 0) {
      const rows = grid.length;
      const cols = Math.max(...grid.map(r => r.length));
      document.getElementById('grid-info').textContent = `${rows} × ${cols} grid detected`;
    }
  },

  solve() {
    const gridVal = this.gridInput?.value;
    const wordsVal = this.wordsInput?.value;

    if (!gridVal?.trim()) {
      this.showError('Please paste your word search grid first.');
      return;
    }
    if (!wordsVal?.trim()) {
      this.showError('Please enter the words you want to find.');
      return;
    }

    this.solveBtnEl.classList.add('loading');
    this.solveBtnEl.disabled = true;

    setTimeout(() => {
      const result = WordSearchEngine.solveAll(gridVal, wordsVal);
      this.solveBtnEl.classList.remove('loading');
      this.solveBtnEl.disabled = false;

      if (result.error) {
        this.showError(result.error);
        return;
      }

      this.renderResults(result);
    }, 100);
  },

  clear() {
    this.gridInput.value = '';
    this.wordsInput.value = '';
    document.getElementById('grid-info').textContent = '';
    this.resultsSection.innerHTML = '';
    this.resultsSection.classList.remove('visible');
  },

  showError(msg) {
    this.resultsSection.innerHTML = `
      <div class="error-box">
        <span class="error-icon">⚠️</span>
        <p>${msg}</p>
      </div>`;
    this.resultsSection.classList.add('visible');
  },

  renderResults(result) {
    const { grid, words, allResults, found, notFound, highlightMap } = result;
    const wordColorMap = {};
    words.forEach((w, i) => { wordColorMap[w] = WORD_COLORS[i % WORD_COLORS.length]; });

    const gridHTML = this.buildGridHTML(grid, highlightMap, words, wordColorMap);
    const summaryHTML = this.buildSummaryHTML(found, notFound, wordColorMap);
    const resultsListHTML = this.buildResultsListHTML(allResults, wordColorMap);

    this.resultsSection.innerHTML = `
      <div class="results-header">
        <h2>🎯 Results</h2>
        <div class="results-stats">
          <span class="stat found-stat">${found.length} found</span>
          ${notFound.length ? `<span class="stat not-found-stat">${notFound.length} not found</span>` : ''}
          <span class="stat">${allResults.length} occurrence${allResults.length !== 1 ? 's' : ''}</span>
        </div>
        <button id="copy-results-btn" class="btn-copy" title="Copy results">📋 Copy Results</button>
      </div>
      ${summaryHTML}
      <div class="results-body">
        <div class="grid-section">
          <h3>Highlighted Grid</h3>
          <div class="grid-scroll-wrapper">
            <div class="word-grid-display" id="word-grid">
              ${gridHTML}
            </div>
          </div>
          <div class="grid-legend" id="grid-legend">
            ${words.map(w => found.includes(w) ? `<span class="legend-item" style="--wc:${wordColorMap[w]}">${w}</span>` : '').join('')}
          </div>
        </div>
        <div class="list-section">
          <h3>Word Locations</h3>
          ${resultsListHTML}
          ${notFound.length ? `
          <div class="not-found-list">
            <h4>❌ Not Found</h4>
            ${notFound.map(w => `<span class="word-tag not-found-tag">${w}</span>`).join('')}
          </div>` : ''}
        </div>
      </div>`;

    this.resultsSection.classList.add('visible');
    this.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    document.getElementById('copy-results-btn')?.addEventListener('click', () => this.copyResults(allResults, notFound));

    // Hover highlight sync
    this.initHoverSync(grid, highlightMap, words, wordColorMap, allResults);
  },

  buildGridHTML(grid, highlightMap, words, wordColorMap) {
    return grid.map((row, r) =>
      `<div class="grid-row">${row.map((cell, c) => {
        const key = `${r},${c}`;
        const wordIdxs = highlightMap[key] || [];
        if (wordIdxs.length > 0) {
          const word = words[wordIdxs[0]];
          const color = wordColorMap[word] || '#e63946';
          return `<span class="grid-cell highlighted" style="--wc:${color}" data-pos="${r},${c}">${cell}</span>`;
        }
        return `<span class="grid-cell" data-pos="${r},${c}">${cell}</span>`;
      }).join('')}</div>`
    ).join('');
  },

  buildSummaryHTML(found, notFound, wordColorMap) {
    return `<div class="summary-strip">
      ${found.map(w => `<span class="word-tag found-tag" style="--wc:${wordColorMap[w]}">${w}</span>`).join('')}
    </div>`;
  },

  buildResultsListHTML(allResults, wordColorMap) {
    if (!allResults.length) return '<p class="no-results">No words found.</p>';
    const grouped = {};
    allResults.forEach(r => {
      if (!grouped[r.word]) grouped[r.word] = [];
      grouped[r.word].push(r);
    });
    return Object.entries(grouped).map(([word, matches]) => {
      const color = wordColorMap[word] || '#e63946';
      return `<div class="word-result-group">
        <div class="word-result-label" style="--wc:${color}">
          <span class="dot"></span> ${word}
          ${matches.length > 1 ? `<span class="multi-badge">${matches.length}×</span>` : ''}
        </div>
        ${matches.map((m, i) => `
          <div class="match-detail" data-word="${word}" data-match="${i}">
            <span class="match-pos">Row ${m.startRow}, Col ${m.startCol}</span>
            <span class="match-dir">${m.direction}</span>
          </div>`).join('')}
      </div>`;
    }).join('');
  },

  initHoverSync(grid, highlightMap, words, wordColorMap, allResults) {
    // Hover on result → dim other cells
    document.querySelectorAll('.match-detail').forEach(el => {
      el.addEventListener('mouseenter', () => {
        const word = el.dataset.word;
        const idx = parseInt(el.dataset.match);
        const match = allResults.filter(r => r.word === word)[idx];
        if (!match) return;
        const activeCells = new Set(match.cells.map(c => `${c.r},${c.c}`));
        document.querySelectorAll('.grid-cell').forEach(cell => {
          cell.classList.toggle('dim', !activeCells.has(cell.dataset.pos));
          cell.classList.toggle('focus', activeCells.has(cell.dataset.pos));
        });
      });
      el.addEventListener('mouseleave', () => {
        document.querySelectorAll('.grid-cell').forEach(cell => {
          cell.classList.remove('dim', 'focus');
        });
      });
    });
  },

  copyResults(allResults, notFound) {
    if (!allResults) return;
    const lines = allResults.map(r =>
      `${r.word}: Row ${r.startRow}, Col ${r.startCol} — ${r.direction}`
    );
    if (notFound?.length) lines.push('\nNot Found: ' + notFound.join(', '));
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      const btn = document.getElementById('copy-results-btn');
      if (btn) { btn.textContent = '✅ Copied!'; setTimeout(() => btn.textContent = '📋 Copy Results', 2000); }
    });
  }
};

// ========= Scroll Animations =========
const ScrollAnimations = {
  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
  }
};

// ========= FAQ Accordion =========
const FAQ = {
  init() {
    document.querySelectorAll('.faq-question').forEach(q => {
      q.addEventListener('click', () => {
        const item = q.parentElement;
        const wasOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!wasOpen) item.classList.add('open');
      });
    });
  }
};

// ========= Counter Animations =========
const Counters = {
  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('.counter-num').forEach(el => observer.observe(el));
  },
  animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const duration = 1800;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(ease * target).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString() + (el.dataset.suffix || '');
    };
    requestAnimationFrame(tick);
  }
};

// ========= App Boot =========
document.addEventListener('DOMContentLoaded', () => {
  // Inject header
  const headerMount = document.getElementById('header-mount');
  if (headerMount) {
    headerMount.innerHTML = Header.render();
    Header.init();
  }
  // Inject footer
  const footerMount = document.getElementById('footer-mount');
  if (footerMount) {
    footerMount.innerHTML = Footer.render();
    Footer.init();
  }

  SolverUI.init();
  ScrollAnimations.init();
  FAQ.init();
  Counters.init();
});
