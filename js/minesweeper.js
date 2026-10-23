(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var LEVELS = { beginner: { r: 9, c: 9, m: 10 }, intermediate: { r: 16, c: 16, m: 40 }, expert: { r: 30, c: 16, m: 99 } };
  var KEY = 'ms-best-v1';
  var boardEl = $('ms-board'), face = $('ms-face'), statusEl = $('ms-status');
  var lvl = 'beginner', R, C, M, mines, nums, state, started, over, flags, opened, timer, secs, flagMode = false, best = {};
  try { best = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) {}

  function idx(r, c) { return r * C + c; }
  function neighbors(r, c) {
    var out = [];
    for (var dr = -1; dr <= 1; dr++) for (var dc = -1; dc <= 1; dc++) {
      if (!dr && !dc) continue;
      var rr = r + dr, cc = c + dc;
      if (rr >= 0 && cc >= 0 && rr < R && cc < C) out.push(idx(rr, cc));
    }
    return out;
  }

  function cellSize() {
    var avail = Math.min(boardEl.parentElement.clientWidth || 340, 640) - 16;
    return Math.max(20, Math.min(34, Math.floor((avail - (C + 1) * 2) / C)));
  }

  function build() {
    var L = LEVELS[lvl]; R = L.r; C = L.c; M = L.m;
    mines = new Array(R * C).fill(false); nums = new Array(R * C).fill(0); state = new Array(R * C).fill(0); // 0 hidden 1 open 2 flag
    started = false; over = false; flags = 0; opened = 0; secs = 0; clearInterval(timer);
    boardEl.style.gridTemplateColumns = 'repeat(' + C + ',var(--ms-cell))';
    boardEl.style.setProperty('--ms-cell', cellSize() + 'px');
    boardEl.innerHTML = '';
    var frag = document.createDocumentFragment();
    for (var r = 0; r < R; r++) for (var c = 0; c < C; c++) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'ms-cell'; b.dataset.r = r; b.dataset.c = c;
      b.setAttribute('aria-label', 'Row ' + (r + 1) + ', column ' + (c + 1) + ', hidden'); frag.appendChild(b);
    }
    boardEl.appendChild(frag);
    face.textContent = '🙂'; statusEl.textContent = ''; hud(); bestLine();
  }

  function hud() { $('ms-mines').textContent = Math.max(-99, M - flags); $('ms-time').textContent = secs; }
  function bestLine() { $('ms-best').textContent = best[lvl] ? best[lvl] + 's' : '—'; }

  function place(sr, sc) {
    var safe = new Set(neighbors(sr, sc).concat(idx(sr, sc))), placed = 0;
    if (R * C - safe.size < M) safe = new Set([idx(sr, sc)]);
    while (placed < M) { var i = Math.floor(Math.random() * R * C); if (!mines[i] && !safe.has(i)) { mines[i] = true; placed++; } }
    for (var r = 0; r < R; r++) for (var c = 0; c < C; c++) nums[idx(r, c)] = neighbors(r, c).filter(function (n) { return mines[n]; }).length;
  }

  function paint(i) {
    var el = boardEl.children[i], r = Math.floor(i / C), c = i % C;
    el.className = 'ms-cell'; el.textContent = ''; el.removeAttribute('data-n');
    var label = 'Row ' + (r + 1) + ', column ' + (c + 1) + ', ';
    if (state[i] === 1) {
      el.classList.add('open');
      if (mines[i]) { el.textContent = '💣'; el.classList.add('mine'); label += 'mine'; }
      else if (nums[i]) { el.textContent = nums[i]; el.dataset.n = nums[i]; label += nums[i] + ' adjacent mines'; }
      else label += 'empty';
    } else if (state[i] === 2) { el.textContent = '🚩'; label += 'flagged'; }
    else label += 'hidden';
    el.setAttribute('aria-label', label);
  }

  function reveal(i) {
    var stack = [i];
    while (stack.length) {
      var k = stack.pop();
      if (state[k] !== 0) continue;
      state[k] = 1; opened++; paint(k);
      if (nums[k] === 0 && !mines[k]) neighbors(Math.floor(k / C), k % C).forEach(function (n) { if (state[n] === 0) stack.push(n); });
    }
  }

  function lose(hit) {
    over = true; clearInterval(timer); face.textContent = '😵';
    for (var i = 0; i < R * C; i++) {
      if (mines[i] && state[i] !== 2) { state[i] = 1; paint(i); }
      else if (!mines[i] && state[i] === 2) { paint(i); boardEl.children[i].classList.add('wrong'); boardEl.children[i].textContent = '🚩'; }
    }
    boardEl.children[hit].classList.add('boom');
    statusEl.textContent = 'Boom! You hit a mine. Tap the face to try again.';
  }

  function win() {
    over = true; clearInterval(timer); face.textContent = '😎';
    for (var i = 0; i < R * C; i++) if (mines[i] && state[i] !== 2) { state[i] = 2; paint(i); }
    flags = M; hud();
    var msg = 'Cleared in ' + secs + ' seconds!';
    if (!best[lvl] || secs < best[lvl]) { best[lvl] = secs; try { localStorage.setItem(KEY, JSON.stringify(best)); } catch (e) {} msg += ' New best time.'; bestLine(); }
    statusEl.textContent = '🎉 ' + msg;
  }

  function open(i) {
    if (over || state[i] === 2) return;
    var r = Math.floor(i / C), c = i % C;
    if (state[i] === 1) { chord(i); return; }
    if (!started) { started = true; place(r, c); timer = setInterval(function () { secs++; hud(); }, 1000); }
    if (mines[i]) { state[i] = 1; paint(i); return lose(i); }
    reveal(i);
    if (opened === R * C - M) win();
  }

  function chord(i) {
    if (!nums[i]) return;
    var nb = neighbors(Math.floor(i / C), i % C), f = nb.filter(function (n) { return state[n] === 2; }).length;
    if (f !== nums[i]) return;
    for (var k = 0; k < nb.length; k++) {
      var n = nb[k];
      if (state[n] === 0) { if (mines[n]) { state[n] = 1; paint(n); return lose(n); } reveal(n); }
    }
    if (!over && opened === R * C - M) win();
  }

  function flag(i) {
    if (over || state[i] === 1) return;
    state[i] = state[i] === 2 ? 0 : 2; flags += state[i] === 2 ? 1 : -1; paint(i); hud();
  }

  var pressT = 0, longFired = false;
  boardEl.addEventListener('pointerdown', function (e) {
    var b = e.target.closest('.ms-cell'); if (!b || e.button === 2) return;
    longFired = false; clearTimeout(pressT);
    if (e.pointerType === 'touch' || e.pointerType === 'pen') pressT = setTimeout(function () { longFired = true; flag(idx(+b.dataset.r, +b.dataset.c)); if (navigator.vibrate) navigator.vibrate(15); }, 380);
  });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) { boardEl.addEventListener(ev, function () { clearTimeout(pressT); }); });
  boardEl.addEventListener('click', function (e) {
    var b = e.target.closest('.ms-cell'); if (!b) return;
    if (longFired) { longFired = false; return; }
    var i = idx(+b.dataset.r, +b.dataset.c);
    if (flagMode && state[i] !== 1) flag(i); else open(i);
  });
  boardEl.addEventListener('contextmenu', function (e) { e.preventDefault(); var b = e.target.closest('.ms-cell'); if (b) flag(idx(+b.dataset.r, +b.dataset.c)); });
  boardEl.addEventListener('keydown', function (e) {
    var b = e.target.closest('.ms-cell'); if (!b) return;
    var r = +b.dataset.r, c = +b.dataset.c, m = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
    if (m[e.key]) { e.preventDefault(); var nr = r + m[e.key][0], nc = c + m[e.key][1]; if (nr >= 0 && nc >= 0 && nr < R && nc < C) boardEl.children[idx(nr, nc)].focus(); }
    else if (e.key === 'f' || e.key === 'F') flag(idx(r, c));
  });

  $('ms-level').addEventListener('change', function () { lvl = this.value; build(); });
  face.addEventListener('click', build);
  $('ms-flag').addEventListener('click', function () { flagMode = !flagMode; this.setAttribute('aria-pressed', flagMode); this.classList.toggle('pp-btn--active', flagMode); this.textContent = flagMode ? '🚩 Flag mode: ON' : '🚩 Flag mode: OFF'; });
  var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { boardEl.style.setProperty('--ms-cell', cellSize() + 'px'); }, 150); });
  build();
})();
