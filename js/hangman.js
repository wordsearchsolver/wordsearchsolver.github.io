(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var BANK = {
    'Animals': 'elephant giraffe penguin dolphin kangaroo crocodile butterfly squirrel hedgehog octopus cheetah gorilla flamingo chameleon porcupine peacock jellyfish armadillo buffalo leopard raccoon seahorse tortoise woodpecker platypus'.split(' '),
    'Countries': 'australia argentina brazil canada denmark egypt finland germany iceland jamaica kenya lebanon mexico norway portugal switzerland thailand uruguay vietnam singapore morocco indonesia colombia ireland sweden'.split(' '),
    'Food': 'sandwich pancake spaghetti broccoli avocado burrito pineapple chocolate cinnamon mushroom blueberry lasagna popcorn croissant dumpling pretzel cucumber omelette strawberry watermelon cauliflower noodles pepperoni'.split(' '),
    'Sports': 'basketball football baseball swimming gymnastics volleyball badminton wrestling archery cricket skateboard snowboard marathon hockey bowling surfing fencing rowing climbing tennis cycling boxing karate softball'.split(' '),
    'Science': 'gravity electron molecule planet volcano galaxy oxygen fossil magnet photosynthesis telescope microscope asteroid hurricane evolution neutron chemistry biology glacier ecosystem satellite eclipse'.split(' '),
    'Everyday': 'umbrella backpack calendar notebook keyboard bicycle sunglasses scissors blanket mirror elevator staircase suitcase envelope flashlight pillow toothbrush refrigerator microphone headphones wardrobe'.split(' ')
  };
  var MAX = 6, KEY = 'hm-stats-v1';
  var cat = $('hm-cat'), wordEl = $('hm-word'), keysEl = $('hm-keys'), statusEl = $('hm-status');
  var word, guessed, wrong, over, hintUsed, stats = { w: 0, l: 0, streak: 0, best: 0 };
  try { var s = JSON.parse(localStorage.getItem(KEY)); if (s) stats = s; } catch (e) {}

  Object.keys(BANK).forEach(function (k) { var o = document.createElement('option'); o.value = k; o.textContent = k; cat.appendChild(o); });
  var allOpt = document.createElement('option'); allOpt.value = '*'; allOpt.textContent = 'Mixed'; cat.insertBefore(allOpt, cat.firstChild); cat.value = '*';

  keysEl.innerHTML = '';
  'abcdefghijklmnopqrstuvwxyz'.split('').forEach(function (c) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'pp-key'; b.textContent = c; b.dataset.k = c;
    b.setAttribute('aria-label', 'Letter ' + c); keysEl.appendChild(b);
  });

  function pick() {
    var pool = cat.value === '*' ? [].concat.apply([], Object.keys(BANK).map(function (k) { return BANK[k]; })) : BANK[cat.value];
    var w; do { w = pool[Math.floor(Math.random() * pool.length)]; } while (pool.length > 1 && w === word);
    return w;
  }

  function save() { try { localStorage.setItem(KEY, JSON.stringify(stats)); } catch (e) {} }

  function draw() {
    wordEl.innerHTML = '';
    word.split('').forEach(function (c) {
      var d = document.createElement('div'); d.className = 'hm-letter';
      var show = guessed.has(c) || over;
      d.textContent = show ? c : '';
      if (over && !guessed.has(c)) d.classList.add('miss');
      wordEl.appendChild(d);
    });
    wordEl.setAttribute('aria-label', word.split('').map(function (c) { return guessed.has(c) ? c : 'blank'; }).join(' '));
    document.querySelectorAll('.hm-fig .part').forEach(function (p, i) { p.classList.toggle('on', i < wrong); });
    keysEl.querySelectorAll('.pp-key').forEach(function (b) {
      var c = b.dataset.k, g = guessed.has(c);
      b.disabled = g || over;
      b.classList.toggle('ok', g && word.indexOf(c) > -1);
      b.classList.toggle('no', g && word.indexOf(c) === -1);
    });
    $('hm-left').textContent = (MAX - wrong);
    $('hm-w').textContent = stats.w; $('hm-l').textContent = stats.l; $('hm-streak').textContent = stats.streak; $('hm-best').textContent = stats.best;
    $('hm-hint').disabled = over || hintUsed || wrong >= MAX - 1;
  }

  function guess(c) {
    if (over || guessed.has(c)) return;
    guessed.add(c);
    if (word.indexOf(c) === -1) wrong++;
    check();
  }

  function check() {
    var won = word.split('').every(function (c) { return guessed.has(c); });
    if (won) { over = true; stats.w++; stats.streak++; stats.best = Math.max(stats.best, stats.streak); statusEl.textContent = '🎉 You saved him! The word was “' + word + '”.'; save(); }
    else if (wrong >= MAX) { over = true; stats.l++; stats.streak = 0; statusEl.textContent = '💀 Game over — the word was “' + word + '”.'; save(); }
    else statusEl.textContent = '';
    draw();
  }

  function start() {
    word = pick(); guessed = new Set(); wrong = 0; over = false; hintUsed = false; statusEl.textContent = '';
    $('hm-cat-label').textContent = cat.value === '*' ? 'Mixed categories' : cat.value;
    $('hm-len').textContent = word.length;
    draw();
  }

  keysEl.addEventListener('click', function (e) { var b = e.target.closest('.pp-key'); if (b) guess(b.dataset.k); });
  document.addEventListener('keydown', function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var t = e.target.tagName;
    if (t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT') return;
    if (/^[a-zA-Z]$/.test(e.key)) guess(e.key.toLowerCase());
    else if (e.key === 'Enter' && over) start();
  });
  $('hm-new').addEventListener('click', start);
  cat.addEventListener('change', start);
  $('hm-hint').addEventListener('click', function () {
    if (over || hintUsed) return;
    var left = word.split('').filter(function (c) { return !guessed.has(c); });
    if (!left.length) return;
    hintUsed = true; guessed.add(left[Math.floor(Math.random() * left.length)]); wrong++;
    statusEl.textContent = 'Hint used — a letter was revealed and it cost one life.';
    check();
  });
  start();
})();
