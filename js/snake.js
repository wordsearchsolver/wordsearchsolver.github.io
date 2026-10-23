(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var canvas = $('sn-canvas'), ctx = canvas.getContext('2d'), overlay = $('sn-overlay');
  var N = 20, KEY = 'sn-best-v1';
  var snake, dir, queue, food, score, best = 0, running = false, paused = false, dead = false, wrap = false, tick = 140, last = 0, acc = 0, raf = 0;
  try { best = parseInt(localStorage.getItem(KEY), 10) || 0; } catch (e) {}

  function size() {
    var w = canvas.clientWidth, d = window.devicePixelRatio || 1;
    canvas.width = Math.round(w * d); canvas.height = Math.round(w * d);
    draw();
  }

  function reset() {
    snake = [{ x: 9, y: 10 }, { x: 8, y: 10 }, { x: 7, y: 10 }];
    dir = { x: 1, y: 0 }; queue = []; score = 0; tick = 140; dead = false; paused = false; acc = 0;
    placeFood(); updateHud();
  }

  function placeFood() {
    var free = [];
    for (var x = 0; x < N; x++) for (var y = 0; y < N; y++) if (!snake.some(function (s) { return s.x === x && s.y === y; })) free.push({ x: x, y: y });
    food = free.length ? free[Math.floor(Math.random() * free.length)] : null;
  }

  function updateHud() { $('sn-score').textContent = score; $('sn-best').textContent = best; $('sn-speed').textContent = Math.round((140 - tick) / 6) + 1; }

  function steer(dx, dy) {
    var ref = queue.length ? queue[queue.length - 1] : dir;
    if (ref.x === -dx && ref.y === -dy) return;
    if (ref.x === dx && ref.y === dy) return;
    if (queue.length < 3) queue.push({ x: dx, y: dy });
    if (!running && !dead) startGame();
  }

  function step() {
    if (queue.length) dir = queue.shift();
    var h = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    if (wrap) { h.x = (h.x + N) % N; h.y = (h.y + N) % N; }
    else if (h.x < 0 || h.y < 0 || h.x >= N || h.y >= N) return die();
    var willEat = food && h.x === food.x && h.y === food.y;
    var body = willEat ? snake : snake.slice(0, -1);
    if (body.some(function (s) { return s.x === h.x && s.y === h.y; })) return die();
    snake.unshift(h);
    if (willEat) { score += 10; tick = Math.max(60, tick - 4); placeFood(); if (score > best) { best = score; try { localStorage.setItem(KEY, best); } catch (e) {} } updateHud(); if (!food) die(true); }
    else snake.pop();
  }

  function die(win) {
    dead = true; running = false; cancelAnimationFrame(raf);
    $('sn-title').textContent = win ? 'You filled the board!' : 'Game over';
    $('sn-msg').textContent = 'Score ' + score + (score && score >= best ? ' — new best!' : '') + '. Press Space or tap Play.';
    $('sn-start').textContent = 'Play again';
    overlay.classList.add('show'); draw();
  }

  function loop(t) {
    if (!running) return;
    if (!last) last = t;
    acc += t - last; last = t;
    if (!paused) { while (acc >= tick && running) { step(); acc -= tick; } } else acc = 0;
    draw();
    if (running) raf = requestAnimationFrame(loop);
  }

  function startGame() {
    if (dead || !snake) reset();
    running = true; paused = false; last = 0; acc = 0; overlay.classList.remove('show');
    cancelAnimationFrame(raf); raf = requestAnimationFrame(loop);
  }

  function togglePause() {
    if (!running) return;
    paused = !paused;
    $('sn-pause').textContent = paused ? '▶ Resume' : '⏸ Pause';
    if (paused) { $('sn-title').textContent = 'Paused'; $('sn-msg').textContent = 'Press Space or tap Resume.'; $('sn-start').textContent = 'Resume'; overlay.classList.add('show'); }
    else overlay.classList.remove('show');
  }

  function draw() {
    var w = canvas.width, c = w / N;
    ctx.clearRect(0, 0, w, w);
    for (var x = 0; x < N; x++) for (var y = 0; y < N; y++) { ctx.fillStyle = (x + y) % 2 ? '#e1efd8' : '#e9f4e1'; ctx.fillRect(x * c, y * c, c, c); }
    if (food) { ctx.fillStyle = '#e76f51'; ctx.beginPath(); ctx.arc((food.x + .5) * c, (food.y + .55) * c, c * .36, 0, 6.2832); ctx.fill(); ctx.fillStyle = '#2a9d8f'; ctx.fillRect((food.x + .46) * c, (food.y + .08) * c, c * .1, c * .2); }
    if (!snake) return;
    snake.forEach(function (s, i) {
      ctx.fillStyle = i === 0 ? '#1f7a6e' : (i % 2 ? '#2a9d8f' : '#34ad9f');
      var p = c * .06; ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(s.x * c + p, s.y * c + p, c - 2 * p, c - 2 * p, c * .28); else ctx.rect(s.x * c + p, s.y * c + p, c - 2 * p, c - 2 * p);
      ctx.fill();
    });
    var hd = snake[0]; ctx.fillStyle = '#fff';
    var ex = dir.y ? [.3, .7] : [.62, .62], ey = dir.y ? [.55 + dir.y * .12, .55 + dir.y * .12] : [.3, .7];
    if (dir.x === -1) ex = [.38, .38];
    for (var k = 0; k < 2; k++) { ctx.beginPath(); ctx.arc((hd.x + ex[k]) * c, (hd.y + ey[k]) * c, c * .09, 0, 6.2832); ctx.fill(); }
  }

  document.addEventListener('keydown', function (e) {
    var t = e.target.tagName; if (t === 'INPUT' || t === 'SELECT' || t === 'TEXTAREA') return;
    var k = e.key, m = { ArrowUp: [0, -1], w: [0, -1], W: [0, -1], ArrowDown: [0, 1], s: [0, 1], S: [0, 1], ArrowLeft: [-1, 0], a: [-1, 0], A: [-1, 0], ArrowRight: [1, 0], d: [1, 0], D: [1, 0] };
    if (m[k]) { e.preventDefault(); steer(m[k][0], m[k][1]); }
    else if (k === ' ' || k === 'p' || k === 'P') {
      if (t === 'BUTTON') return;
      e.preventDefault(); if (!running) startGame(); else togglePause();
    }
  });

  var sx = 0, sy = 0;
  canvas.addEventListener('touchstart', function (e) { var t = e.touches[0]; sx = t.clientX; sy = t.clientY; }, { passive: true });
  canvas.addEventListener('touchmove', function (e) { e.preventDefault(); }, { passive: false });
  canvas.addEventListener('touchend', function (e) {
    var t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return;
    if (Math.abs(dx) > Math.abs(dy)) steer(dx > 0 ? 1 : -1, 0); else steer(0, dy > 0 ? 1 : -1);
  }, { passive: true });

  document.querySelectorAll('.sn-pad button').forEach(function (b) {
    b.addEventListener('click', function () { var d = b.dataset.d; steer(d === 'l' ? -1 : d === 'r' ? 1 : 0, d === 'u' ? -1 : d === 'd' ? 1 : 0); });
  });
  $('sn-start').addEventListener('click', function () { if (paused) togglePause(); else { if (dead) reset(); startGame(); } });
  $('sn-pause').addEventListener('click', function () { if (!running) startGame(); else togglePause(); });
  $('sn-mode').addEventListener('click', function () {
    wrap = !wrap; this.textContent = wrap ? '🔁 Walls: Wrap' : '🧱 Walls: Deadly'; this.setAttribute('aria-pressed', wrap);
    if (running || dead) { running = false; cancelAnimationFrame(raf); reset(); $('sn-title').textContent = 'Snake'; $('sn-msg').textContent = 'Mode changed. Press Space or tap Play.'; $('sn-start').textContent = 'Play'; overlay.classList.add('show'); draw(); }
  });
  document.addEventListener('visibilitychange', function () { if (document.hidden && running && !paused) togglePause(); });
  window.addEventListener('resize', size);

  reset(); size();
})();
