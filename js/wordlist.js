/* ============================================
   Crossword Solver — Pattern Matching Engine
   Runs entirely client-side against a local
   60,000+ word dictionary (js/wordlist.js)
   ============================================ */
(function () {
  'use strict';

  const WORDS = (typeof window !== 'undefined' && window.CW_WORDS) ? window.CW_WORDS : {};
  const MAX_RENDER = 400; // render cap for very loose patterns (perf + readability)

  // ----- DOM refs -----
  const patternInput   = document.getElementById('cw-pattern');
  const containsInput  = document.getElementById('cw-contains');
  const excludeInput   = document.getElementById('cw-exclude');
  const solveBtn       = document.getElementById('cw-solve-btn');
  const sampleBtn      = document.getElementById('cw-sample-btn');
  const clearBtn       = document.getElementById('cw-clear-btn');
  const previewWrap    = document.getElementById('cw-pattern-preview');
  const lengthTag      = document.getElementById('cw-length-tag');
  const resultsSection = document.getElementById('cw-results-section');
  const errorBox       = document.getElementById('cw-error-box');

  if (!patternInput || !solveBtn) return; // page not present

  // ----- Helpers -----
  function normalizePattern(raw) {
    return raw
      .toUpperCase()
      .replace(/\s+/g, '')
      .replace(/[_*]/g, '?')
      .replace(/[^A-Z?]/g, '');
  }

  function normalizeLetters(raw) {
    return raw
      .toUpperCase()
      .split(/[,\s]+/)
      .map(s => s.replace(/[^A-Z]/g, ''))
      .filter(Boolean);
  }

  function renderPreview() {
    const pattern = normalizePattern(patternInput.value);
    previewWrap.innerHTML = '';
    if (!pattern) {
      lengthTag.textContent = '';
      return;
    }
    pattern.split('').forEach(ch => {
      const cell = document.createElement('span');
      cell.className = 'cw-cell' + (ch === '?' ? ' blank' : '');
      cell.textContent = ch === '?' ? '' : ch;
      previewWrap.appendChild(cell);
    });
    lengthTag.textContent = pattern.length + ' letter' + (pattern.length === 1 ? '' : 's');
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function showError(msg) {
    resultsSection.classList.remove('visible');
    errorBox.innerHTML = `<p>⚠️ ${escapeHtml(msg)}</p>`;
    errorBox.style.display = 'flex';
  }

  function hideError() {
    errorBox.style.display = 'none';
    errorBox.innerHTML = '';
  }

  function solve() {
    hideError();
    const pattern = normalizePattern(patternInput.value);

    if (!pattern) {
      showError('Please enter a pattern, e.g. C?T or CRO?SWORD, using ? or _ for unknown letters.');
      return;
    }
    if (pattern.length > 20) {
      showError('Please keep patterns to 20 letters or fewer.');
      return;
    }

    const mustContain = normalizeLetters(containsInput ? containsInput.value : '');
    const mustExclude = normalizeLetters(excludeInput ? excludeInput.value : '');

    const bucket = WORDS[pattern.length] || [];
    const regex = new RegExp('^' + pattern.split('').map(c => c === '?' ? '.' : c).join('') + '$');

    let matches = bucket.filter(w => regex.test(w));

    if (mustContain.length) {
      matches = matches.filter(w => mustContain.every(l => w.includes(l)));
    }
    if (mustExclude.length) {
      matches = matches.filter(w => mustExclude.every(l => !w.includes(l)));
    }

    matches.sort();
    renderResults(pattern, matches);
  }

  function renderResults(pattern, matches) {
    resultsSection.innerHTML = '';

    const header = document.createElement('div');
    header.className = 'results-header';
    header.innerHTML = `
      <h2>Results for <span class="cw-pattern-echo">${escapeHtml(pattern.replace(/\?/g, '•'))}</span></h2>
      <div class="results-stats">
        <span class="stat found-stat">${matches.length} match${matches.length === 1 ? '' : 'es'} found</span>
        <span class="stat">${pattern.length}-letter pattern</span>
      </div>
      <button class="btn-copy" id="cw-copy-btn" type="button">📋 Copy All</button>
    `;
    resultsSection.appendChild(header);

    if (!matches.length) {
      const empty = document.createElement('div');
      empty.className = 'not-found-list';
      empty.innerHTML = `<h4>No words matched</h4><p style="font-size:14px;color:var(--text-muted);">Try double-checking your letters, removing a "contains" filter, or widening the pattern with more blanks.</p>`;
      resultsSection.appendChild(empty);
    } else {
      const wrap = document.createElement('div');
      wrap.className = 'cw-matches-grid';
      const shown = matches.slice(0, MAX_RENDER);
      shown.forEach(w => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'cw-match-chip';
        chip.textContent = w;
        chip.title = 'Click to copy "' + w + '"';
        chip.addEventListener('click', () => {
          navigator.clipboard && navigator.clipboard.writeText(w).catch(() => {});
          chip.classList.add('copied');
          setTimeout(() => chip.classList.remove('copied'), 900);
        });
        wrap.appendChild(chip);
      });
      resultsSection.appendChild(wrap);

      if (matches.length > MAX_RENDER) {
        const note = document.createElement('p');
        note.style.cssText = 'margin-top:16px;font-size:13px;color:var(--text-muted);text-align:center;';
        note.textContent = `Showing the first ${MAX_RENDER} of ${matches.length} matches. Narrow your pattern or add "must contain" letters to shorten the list.`;
        resultsSection.appendChild(note);
      }

      const copyBtn = document.getElementById('cw-copy-btn');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          const text = matches.join('\n');
          if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
              copyBtn.textContent = '✅ Copied!';
              setTimeout(() => { copyBtn.textContent = '📋 Copy All'; }, 1500);
            }).catch(() => {});
          }
        });
      }
    }

    resultsSection.classList.add('visible');
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function loadSample() {
    patternInput.value = 'CR?SS??RD';
    if (containsInput) containsInput.value = '';
    if (excludeInput) excludeInput.value = '';
    renderPreview();
    solve();
  }

  function clearAll() {
    patternInput.value = '';
    if (containsInput) containsInput.value = '';
    if (excludeInput) excludeInput.value = '';
    renderPreview();
    hideError();
    resultsSection.classList.remove('visible');
    resultsSection.innerHTML = '';
  }

  patternInput.addEventListener('input', renderPreview);
  solveBtn.addEventListener('click', solve);
  if (sampleBtn) sampleBtn.addEventListener('click', loadSample);
  if (clearBtn) clearBtn.addEventListener('click', clearAll);
  patternInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') solve();
  });

  renderPreview();
})();
