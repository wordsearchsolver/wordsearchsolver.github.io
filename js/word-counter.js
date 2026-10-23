(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var area = $('wc-text');
  var STOP = new Set('a an and are as at be but by for from has have he her his i if in into is it its me my not of on or our she so than that the their them then there these they this to us was we were what when which who will with you your'.split(' '));
  var LIMITS = [
    ['X / Twitter post', 280], ['Meta description', 160], ['SEO title tag', 60],
    ['Instagram caption', 2200], ['SMS (single)', 160]
  ];
  var KEY = 'wc-text-v1';

  var limitsEl = $('wc-limits');
  LIMITS.forEach(function (l, i) {
    var d = document.createElement('div');
    d.className = 'wc-limit'; d.id = 'wc-limit-' + i;
    d.innerHTML = '<div class="pp-row pp-row--between"><span>' + l[0] + '</span><span class="num"></span></div><div class="bar"><i></i></div>';
    limitsEl.appendChild(d);
  });

  function stats(text) {
    var words = text.match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu) || [];
    var chars = Array.from(text).length;
    var noSpace = Array.from(text.replace(/\s/g, '')).length;
    var sentences = (text.match(/[^.!?]+[.!?]+(?=\s|$)|[^.!?]+$/g) || []).filter(function (s) { return /[\p{L}\p{N}]/u.test(s); }).length;
    var paragraphs = text.split(/\n\s*\n/).filter(function (p) { return p.trim(); }).length;
    var lines = text ? text.split(/\n/).length : 0;
    return { words: words, wc: words.length, chars: chars, noSpace: noSpace, sentences: sentences, paragraphs: paragraphs, lines: lines };
  }

  function mins(n, wpm) {
    if (!n) return '0 sec';
    var m = n / wpm;
    if (m < 1) return Math.max(1, Math.round(m * 60)) + ' sec';
    return Math.round(m * 10) / 10 + ' min';
  }

  function render() {
    var text = area.value, s = stats(text);
    $('wc-words').textContent = s.wc.toLocaleString();
    $('wc-chars').textContent = s.chars.toLocaleString();
    $('wc-nospace').textContent = s.noSpace.toLocaleString();
    $('wc-sent').textContent = s.sentences.toLocaleString();
    $('wc-para').textContent = s.paragraphs.toLocaleString();
    $('wc-read').textContent = mins(s.wc, 238);
    $('wc-speak').textContent = mins(s.wc, 130);
    var avg = s.wc ? (s.words.join('').length / s.wc) : 0;
    $('wc-avg').textContent = avg ? avg.toFixed(1) : '0';
    var longest = s.words.reduce(function (a, b) { return b.length > a.length ? b : a; }, '');
    $('wc-longest').textContent = longest || '—';

    LIMITS.forEach(function (l, i) {
      var el = $('wc-limit-' + i), pct = Math.min(100, s.chars / l[1] * 100);
      el.querySelector('.num').textContent = s.chars.toLocaleString() + ' / ' + l[1].toLocaleString();
      el.querySelector('i').style.width = pct + '%';
      el.classList.toggle('over', s.chars > l[1]);
    });

    var skip = $('wc-skipstop').checked, freq = {};
    s.words.forEach(function (w) {
      w = w.toLowerCase();
      if (w.length < 2 || /^\d+$/.test(w)) return;
      if (skip && STOP.has(w)) return;
      freq[w] = (freq[w] || 0) + 1;
    });
    var top = Object.keys(freq).sort(function (a, b) { return freq[b] - freq[a] || a.localeCompare(b); }).slice(0, 10);
    var body = $('wc-kw-body');
    body.innerHTML = '';
    if (!top.length) { body.innerHTML = '<tr><td colspan="3">Start typing to see your most-used words.</td></tr>'; }
    top.forEach(function (w) {
      var tr = document.createElement('tr');
      var a = document.createElement('td'); a.textContent = w;
      var b = document.createElement('td'); b.textContent = freq[w];
      var c = document.createElement('td'); c.textContent = (freq[w] / s.wc * 100).toFixed(1) + '%';
      tr.append(a, b, c); body.appendChild(tr);
    });
    try { localStorage.setItem(KEY, text); } catch (e) {}
  }

  function flash(btn, msg) { var o = btn.dataset.label || btn.textContent; btn.dataset.label = o; btn.textContent = msg; setTimeout(function () { btn.textContent = o; }, 1200); }

  area.addEventListener('input', render);
  $('wc-skipstop').addEventListener('change', render);
  $('wc-clear').addEventListener('click', function () { area.value = ''; render(); area.focus(); });
  $('wc-copy').addEventListener('click', function () {
    var b = this;
    if (navigator.clipboard) navigator.clipboard.writeText(area.value).then(function () { flash(b, 'Copied!'); }, function () { area.select(); });
    else { area.select(); document.execCommand('copy'); flash(b, 'Copied!'); }
  });
  $('wc-paste').addEventListener('click', function () {
    var b = this;
    if (navigator.clipboard && navigator.clipboard.readText) navigator.clipboard.readText().then(function (t) { area.value = t; render(); }, function () { flash(b, 'Use Ctrl+V'); });
    else flash(b, 'Use Ctrl+V');
  });
  $('wc-spaces').addEventListener('click', function () { area.value = area.value.replace(/[ \t]+/g, ' ').replace(/ ?\n ?/g, '\n').replace(/\n{3,}/g, '\n\n').trim(); render(); });
  $('wc-upper').addEventListener('click', function () { area.value = area.value.toUpperCase(); render(); });
  $('wc-lower').addEventListener('click', function () { area.value = area.value.toLowerCase(); render(); });
  $('wc-title').addEventListener('click', function () { area.value = area.value.toLowerCase().replace(/(^|[\s(\["'“‘-])(\p{L})/gu, function (m, a, b) { return a + b.toUpperCase(); }); render(); });

  try { var saved = localStorage.getItem(KEY); if (saved) area.value = saved; } catch (e) {}
  render();
})();
