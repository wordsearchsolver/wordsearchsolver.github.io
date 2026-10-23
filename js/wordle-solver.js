(function () {
  'use strict';
  var WORDS = window.FIVE_LETTER_WORDS || [];
  var $ = function (id) { return document.getElementById(id); };
  var rowsEl = $('ws-rows'), suggEl = $('ws-sugg'), countEl = $('ws-count'), allEl = $('ws-all'), input = $('ws-input');
  var MAX_ROWS = 6;
  var RANK = {}; WORDS.forEach(function (w, i) { RANK[w] = i; });
  var rows = []; // {letters:['',..], states:[0..]}  state: 0 gray, 1 yellow, 2 green
  var cur = ''; // letters typed for the active row

  function feedback(guess, answer) {
    var res = [0, 0, 0, 0, 0], pool = {}, i;
    for (i = 0; i < 5; i++) { if (guess[i] === answer[i]) res[i] = 2; else pool[answer[i]] = (pool[answer[i]] || 0) + 1; }
    for (i = 0; i < 5; i++) { if (res[i] === 0 && pool[guess[i]] > 0) { res[i] = 1; pool[guess[i]]--; } }
    return res;
  }

  function candidates() {
    var done = rows.filter(function (r) { return r.letters.every(Boolean); });
    return WORDS.filter(function (w) {
      for (var k = 0; k < done.length; k++) {
        var g = done[k].letters.join(''), f = feedback(g, w), s = done[k].states;
        for (var i = 0; i < 5; i++) if (f[i] !== s[i]) return false;
      }
      return true;
    });
  }

  function rank(list) {
    var pos = [{}, {}, {}, {}, {}], any = {};
    list.forEach(function (w) {
      var seen = {};
      for (var i = 0; i < 5; i++) { pos[i][w[i]] = (pos[i][w[i]] || 0) + 1; if (!seen[w[i]]) { any[w[i]] = (any[w[i]] || 0) + 1; seen[w[i]] = 1; } }
    });
    var scored = list.map(function (w) {
      var s = 0, seen = {};
      for (var i = 0; i < 5; i++) { s += pos[i][w[i]]; if (!seen[w[i]]) { s += any[w[i]]; seen[w[i]] = 1; } }
      // list is ordered most-common-first, so earlier words get a small boost
      var common = 1 - (RANK[w] / WORDS.length);
      return { w: w, s: s * (0.7 + 0.3 * common) };
    });
    scored.sort(function (a, b) { return b.s - a.s || (a.w < b.w ? -1 : 1); });
    return scored.map(function (x) { return x.w; });
  }

  function renderRows() {
    rowsEl.innerHTML = '';
    rows.forEach(function (r, ri) {
      var div = document.createElement('div'); div.className = 'ws-row'; div.setAttribute('role', 'group');
      div.setAttribute('aria-label', 'Guess ' + (ri + 1));
      for (var i = 0; i < 5; i++) {
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'pp-tile'; b.dataset.r = ri; b.dataset.i = i; b.dataset.s = r.states[i];
        b.textContent = r.letters[i] || '';
        var names = ['gray (not in word)', 'yellow (wrong spot)', 'green (correct)'];
        b.setAttribute('aria-label', 'Letter ' + (i + 1) + ': ' + (r.letters[i] || 'empty') + ', ' + names[r.states[i]] + '. Press to change colour.');
        div.appendChild(b);
      }
      var del = document.createElement('button');
      del.type = 'button'; del.className = 'pp-btn pp-btn--ghost'; del.dataset.del = ri; del.textContent = '✕';
      del.setAttribute('aria-label', 'Remove guess ' + (ri + 1)); div.appendChild(del);
      rowsEl.appendChild(div);
    });
    // typing preview row
    if (cur) {
      var p = document.createElement('div'); p.className = 'ws-row';
      for (var j = 0; j < 5; j++) { var t = document.createElement('div'); t.className = 'pp-tile'; t.style.cursor = 'default'; t.textContent = cur[j] || ''; p.appendChild(t); }
      rowsEl.appendChild(p);
    }
  }

  function update() {
    renderRows();
    var list = candidates(), n = list.length;
    countEl.textContent = n.toLocaleString() + (n === 1 ? ' possible word' : ' possible words');
    suggEl.innerHTML = '';
    var ranked = rank(list);
    ranked.slice(0, 8).forEach(function (w, idx) {
      var b = document.createElement('button'); b.type = 'button'; b.textContent = w;
      b.setAttribute('aria-label', 'Use suggestion ' + w.split('').join(' '));
      if (idx === 0) b.title = 'Top-ranked guess';
      suggEl.appendChild(b);
    });
    if (!n) suggEl.innerHTML = '<p class="pp-note">No matches. Check the colours you entered, or the word may be missing from our dictionary.</p>';
    allEl.textContent = n > 600 ? ranked.slice(0, 600).join(' ') + ' … (' + (n - 600) + ' more)' : ranked.join(' ');
    $('ws-add-note').hidden = rows.length < MAX_ROWS;
  }

  function addGuess(word) {
    if (rows.length >= MAX_ROWS) return;
    rows.push({ letters: word.split(''), states: [0, 0, 0, 0, 0] });
    cur = ''; update();
  }

  input.addEventListener('input', function () {
    var v = input.value.toLowerCase().replace(/[^a-z]/g, '').slice(0, 5);
    input.value = v; cur = v;
    if (v.length === 5) { addGuess(v); input.value = ''; }
    else renderRows();
  });
  $('ws-add').addEventListener('click', function () { if (input.value.length === 5) { addGuess(input.value); input.value = ''; } else input.focus(); });

  rowsEl.addEventListener('click', function (e) {
    var t = e.target.closest('button'); if (!t) return;
    if (t.dataset.del !== undefined) { rows.splice(+t.dataset.del, 1); update(); return; }
    if (t.dataset.r !== undefined) { var r = rows[+t.dataset.r]; r.states[+t.dataset.i] = (r.states[+t.dataset.i] + 1) % 3; update(); }
  });
  suggEl.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b && rows.length < MAX_ROWS) addGuess(b.textContent); });
  $('ws-reset').addEventListener('click', function () { rows = []; cur = ''; input.value = ''; update(); input.focus(); });

  update();
})();
