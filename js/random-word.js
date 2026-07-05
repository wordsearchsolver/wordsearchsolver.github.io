// random-word.js
const RWG = {
  selectedLetter: 'any',
  selectedCat: 'all',
  savedWords: [],
  wordList450k: [],
  currentPool: [],
  currentBigWord: null,

  CATEGORIES: {
    all: ['APPLE', 'BRAVE', 'CLOUD', 'DELTA', 'EAGLE', 'FLAME', 'GRACE', 'HAPPY', 'INDEX', 'JUMBO', 'KNEEL', 'LEMON', 'MAGIC', 'NIGHT', 'OCEAN', 'PIANO', 'QUEST', 'RIVER', 'SOLAR', 'TIGER', 'ULTRA', 'VIVID', 'WATER', 'XENON', 'YACHT', 'ZEBRA', 'CRISP', 'DAILY', 'ELDER', 'FROST', 'GLOBE', 'HOUSE', 'IVORY', 'JOINT', 'KNIFE', 'LIGHT', 'MOUNT', 'NOBLE', 'ORBIT', 'PRIME', 'QUEEN', 'RAPID', 'STONE', 'TRUST', 'UNION', 'VALOR', 'WHOLE', 'EXTRA', 'YOUNG', 'BASIC', 'CHAIN', 'DREAM', 'EMPTY', 'FIXED', 'GREAT', 'HEAVY', 'IDEAL', 'JUDGE', 'KNOWN', 'LARGE', 'MAJOR', 'NORTH', 'OFTEN', 'PLACE', 'QUIET', 'ROUGH', 'SMALL', 'THICK', 'UPPER', 'VALID', 'WASTE', 'EXACT', 'YIELD', 'ZEROS', 'ABOUT', 'BELOW', 'CATCH', 'DRIVE', 'EARLY', 'FAITH', 'GIANT', 'HONOR', 'IMAGE', 'JEWEL', 'KNOCK', 'LOCAL', 'MODEL', 'NERVE', 'OTHER', 'PANEL', 'ROYAL', 'SHARE', 'TOWER', 'UNDER', 'VOICE', 'WORLD', 'CROSS', 'FORCE', 'GUARD', 'HEART', 'INPUT', 'LEVEL', 'METAL', 'NOVEL', 'OFFER', 'POWER', 'SUGAR', 'THINK', 'ULTRA', 'VALUE', 'WRITE'],
    animals: ['TIGER', 'EAGLE', 'SHARK', 'PANDA', 'COBRA', 'BISON', 'HYENA', 'MOOSE', 'HIPPO', 'LLAMA', 'ZEBRA', 'RHINO', 'OTTER', 'VIPER', 'CRANE', 'STORK', 'BISON', 'DINGO', 'FINCH', 'GECKO', 'HERON', 'IGUANA', 'JACKAL', 'KOALA', 'LEMUR', 'MAMBA', 'NEWT', 'OKAPI', 'PUFFIN', 'QUAIL', 'RAVEN', 'SLOTH', 'TAPIR', 'URIAL', 'VOLE', 'WOMBAT', 'XENOPS', 'YABBY', 'ZORILLA'],
    nature: ['CLOUD', 'OCEAN', 'RIVER', 'STORM', 'FROST', 'CEDAR', 'MAPLE', 'BIRCH', 'CORAL', 'DELTA', 'FJORD', 'GLADE', 'HAVEN', 'INLET', 'JUNGLE', 'KARST', 'LAGOON', 'MEADOW', 'NIMBUS', 'OASIS', 'PRAIRIE', 'QUARTZ', 'RAVINE', 'SAVANNA', 'TUNDRA', 'VALLEY', 'MARSH', 'BROOK', 'CLIFF', 'DUNES'],
    food: ['APPLE', 'MANGO', 'GRAPE', 'PEACH', 'LEMON', 'MELON', 'BERRY', 'GUAVA', 'PAPAYA', 'PLUM', 'PIZZA', 'PASTA', 'BREAD', 'CREAM', 'HONEY', 'BACON', 'SUSHI', 'CURRY', 'SALAD', 'TACOS', 'BAGEL', 'DONUT', 'FUDGE', 'LATTE', 'MOCHA', 'NAAN', 'OLIVE', 'PESTO', 'RAMEN', 'STEAK', 'THYME', 'UMAMI', 'WAFFLE'],
    colors: ['AMBER', 'AZURE', 'BEIGE', 'CORAL', 'CREAM', 'EBONY', 'FAWN', 'GOLD', 'IVORY', 'JADE', 'KHAKI', 'LILAC', 'MAROON', 'NAVY', 'OCHRE', 'PEARL', 'RUBY', 'SAGE', 'TEAL', 'UMBER', 'VIOLET', 'WHITE', 'YELLOW', 'SCARLET', 'INDIGO', 'TURQUOISE', 'CRIMSON', 'MAGENTA'],
    verbs: ['CHASE', 'BUILD', 'CRAFT', 'DANCE', 'EXCEL', 'FORGE', 'GRASP', 'HOVER', 'INFER', 'JUMP', 'KNEEL', 'LAUNCH', 'MORPH', 'NUDGE', 'ORBIT', 'PIVOT', 'QUEST', 'REACH', 'SURGE', 'THRIVE', 'UPEND', 'VAULT', 'WIELD', 'YEARN', 'ZOOMS', 'BLEND', 'CLIMB', 'DRIVE', 'EXPAND', 'FILTER'],
    adjectives: ['AGILE', 'BRAVE', 'CRISP', 'DENSE', 'EAGER', 'FLUID', 'GIANT', 'HARDY', 'IDEAL', 'JOVIAL', 'KEEN', 'LUCID', 'MUTED', 'NOBLE', 'OVERT', 'PRIME', 'QUIET', 'RIGID', 'SWIFT', 'TENSE', 'VIVID', 'WARM', 'EXACT', 'YOUNG', 'ZESTY', 'BOLD', 'CLEAR', 'DARK', 'EPIC', 'FAIR'],
    places: ['PARIS', 'TOKYO', 'CAIRO', 'DELHI', 'OSLO', 'ROME', 'LIMA', 'BERN', 'DUBAI', 'ACCRA', 'KABUL', 'LISBON', 'MADRID', 'NAIROBI', 'OTTAWA', 'PRAGUE', 'QUITO', 'RIGA', 'SOFIA', 'TUNIS', 'VIENNA', 'WARSAW', 'BERLIN', 'ATHENS', 'BOGOTA', 'DUBLIN', 'GENEVA', 'HAVANA'],
    tech: ['CLOUD', 'PIXEL', 'CACHE', 'CODEC', 'DEBUG', 'PROXY', 'TOKEN', 'ARRAY', 'QUEUE', 'STACK', 'BINARY', 'CIPHER', 'DATA', 'EPOCH', 'FRAME', 'GRAPH', 'HASH', 'INDEX', 'LOGIC', 'MODEL', 'NODE', 'PARSE', 'REGEX', 'SHARD', 'TABLE', 'UTF', 'VECTOR', 'WIDGET', 'XPATH'],
    emotions: ['HAPPY', 'CALM', 'BRAVE', 'EAGER', 'PROUD', 'JOYFUL', 'SERENE', 'ELATED', 'CONTENT', 'HOPEFUL', 'ANXIOUS', 'WISTFUL', 'TENDER', 'FIERCE', 'BOLD', 'CURIOUS', 'HUMBLE', 'LOYAL', 'MELLOW', 'NOBLE', 'PENSIVE', 'RADIANT', 'SINCERE', 'WARM', 'ZEALOUS']
  },

  setLetter(l, el) {
    this.selectedLetter = l;
    document.querySelectorAll('.lp-btn').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
  },

  setCat(c, el) {
    this.selectedCat = c;
    document.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
  },

  getPool() {
    let pool = this.wordList450k.length > 0 ? this.wordList450k.map(w => w.toUpperCase()) : (this.CATEGORIES[this.selectedCat] || this.CATEGORIES.all);
    if (this.selectedCat !== 'all' && this.wordList450k.length === 0) {
      pool = this.CATEGORIES[this.selectedCat] || this.CATEGORIES.all;
    }
    const minLen = parseInt(document.getElementById('min-len')?.value || 3);
    const maxLen = parseInt(document.getElementById('max-len')?.value || 12);
    pool = pool.filter(w => w.length >= minLen && w.length <= maxLen);
    if (this.selectedLetter !== 'any') {
      pool = pool.filter(w => w.startsWith(this.selectedLetter));
    }
    return pool;
  },

  generate() {
    const mode = document.getElementById('display-mode')?.value || 'grid';
    const count = parseInt(document.getElementById('word-count')?.value || 10);
    const pool = this.getPool();

    if (!pool.length) {
      this.toast('No words match your filters. Try adjusting length or letter.', 'error');
      return;
    }

    const words = [];
    const used = new Set();
    let attempts = 0;

    while (words.length < Math.min(count, pool.length) && attempts < 1000) {
      const w = pool[Math.floor(Math.random() * pool.length)];
      if (!used.has(w)) {
        used.add(w);
        words.push(w);
      }
      attempts++;
    }

    document.getElementById('big-word-mode').style.display = mode === 'big' ? 'block' : 'none';
    document.getElementById('main-output').style.display = mode !== 'big' ? 'block' : 'none';

    if (mode === 'big') {
      this.currentPool = words;
      this.generateOne();
      return;
    }

    if (mode === 'grid') this.renderGrid(words);
    if (mode === 'list') this.renderList(words);
    this.updateStats(words);
  },

  renderGrid(words) {
    const g = document.getElementById('output-grid');
    const l = document.getElementById('output-list');
    const p = document.getElementById('output-placeholder');

    g.style.display = 'grid';
    l.style.display = 'none';
    p.style.display = 'none';

    g.innerHTML = words.map(w =>
      `<div class="wgd-item" onclick="navigator.clipboard?.writeText('${w}');this.style.borderColor='var(--accent-3)';setTimeout(()=>this.style.borderColor='',1000);">
        <span>${w}</span>
        <span class="wgd-len">${w.length}</span>
      </div>`
    ).join('');
  },

  renderList(words) {
    const g = document.getElementById('output-grid');
    const l = document.getElementById('output-list');
    const p = document.getElementById('output-placeholder');

    l.style.display = 'flex';
    g.style.display = 'none';
    p.style.display = 'none';

    l.innerHTML = words.map((w, i) =>
      `<div class="wh-item">
        <span style="font-family:var(--font-mono);font-size:0.75rem;color:var(--text-muted);">${String(i + 1).padStart(2, '0')}</span>
        <span class="wh-word">${w}</span>
        <span class="wh-meta">${w.length} letters</span>
        <span class="wh-len">${w.length}</span>
        <button class="wh-copy" onclick="navigator.clipboard?.writeText('${w}');this.textContent='✓';setTimeout(()=>this.textContent='📋',1000);">📋</button>
      </div>`
    ).join('');
  },

  generateOne() {
    const pool = this.currentPool || this.getPool();
    if (!pool.length) return;

    const word = pool[Math.floor(Math.random() * pool.length)];
    const el = document.getElementById('big-word-text');
    const sub = document.getElementById('big-word-sub');
    const bwd = document.getElementById('big-word-display');

    bwd.classList.add('flipping');
    setTimeout(() => {
      if (el) el.textContent = word;
      if (sub) sub.textContent = `${word.length} letters`;
      bwd.classList.remove('flipping');
    }, 150);

    this.currentBigWord = word;
  },

  copyBigWord() {
    if (this.currentBigWord) {
      navigator.clipboard?.writeText(this.currentBigWord);
      this.toast(`Copied "${this.currentBigWord}"`, 'success');
    }
  },

  addBigWordToList() {
    if (!this.currentBigWord) return;

    this.savedWords.push(this.currentBigWord);
    const sec = document.getElementById('saved-words-section');
    const list = document.getElementById('saved-words-list');

    if (sec) sec.style.display = 'block';
    if (list) {
      list.innerHTML = this.savedWords.map(w =>
        `<span class="badge badge-amber" style="cursor:pointer;" onclick="navigator.clipboard?.writeText('${w}')">${w}</span>`
      ).join('');
    }

    this.toast(`Saved "${this.currentBigWord}"`, 'success');
  },

  copyAll() {
    const words = [...document.querySelectorAll('.wgd-item span:first-child, .wh-word')].map(el => el.textContent);
    if (!words.length) {
      this.toast('Generate words first', 'error');
      return;
    }
    navigator.clipboard?.writeText(words.join('\n'));
    this.toast(`Copied ${words.length} words`, 'success');
  },

  sendToGenerator() {
    const words = [...document.querySelectorAll('.wgd-item span:first-child, .wh-word')].map(el => el.textContent);
    if (!words.length) {
      this.toast('Generate words first', 'error');
      return;
    }
    sessionStorage.setItem('rwg_words', words.join('\n'));
    window.location.href = 'word-search-generator#generator';
  },

  updateStats(words) {
    document.getElementById('rw-stat-count').textContent = words.length;
    const avg = words.reduce((s, w) => s + w.length, 0) / words.length;
    document.getElementById('rw-stat-avg').textContent = avg.toFixed(1);

    const sorted = [...words].sort((a, b) => a.length - b.length);
    document.getElementById('rw-stat-short').textContent = sorted[0] || '—';
    document.getElementById('rw-stat-long').textContent = sorted[sorted.length - 1] || '—';
  },

  toast(msg, type) {
    const c = document.getElementById('toast-container');
    if (!c) return;

    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `<span>${type === 'success' ? '✓' : '✗'}</span><span>${msg}</span>`;
    c.appendChild(t);

    setTimeout(() => {
      t.style.opacity = '0';
      t.style.transition = 'all 0.3s';
      setTimeout(() => t.remove(), 300);
    }, 3000);
  }
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Range display
  const wc = document.getElementById('word-count');
  const wcv = document.getElementById('word-count-val');
  if (wc && wcv) {
    wc.addEventListener('input', () => wcv.textContent = wc.value);
  }

  // FAQ toggle
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // Fade-in observer
  const obs = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    }),
    { threshold: 0.1 }
  );
  document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));
});
