const WordSearchEngine = {
  DIRECTIONS: [
    { name: 'Right →',        dr: 0,  dc: 1  },
    { name: 'Left ←',         dr: 0,  dc: -1 },
    { name: 'Down ↓',         dr: 1,  dc: 0  },
    { name: 'Up ↑',           dr: -1, dc: 0  },
    { name: 'Down-Right ↘',   dr: 1,  dc: 1  },
    { name: 'Down-Left ↙',    dr: 1,  dc: -1 },
    { name: 'Up-Right ↗',     dr: -1, dc: 1  },
    { name: 'Up-Left ↖',      dr: -1, dc: -1 },
  ],

  parseGrid(input) {
    return input.trim().split('\n').map(row =>
      row.trim().toUpperCase().split(/\s+|,/).filter(c => c.length === 1)
    ).filter(row => row.length > 0);
  },

  findWord(grid, word) {
    const rows = grid.length;
    if (!rows) return null;
    const cols = grid[0].length;
    const W = word.toUpperCase();
    const results = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        for (const dir of this.DIRECTIONS) {
          if (this._matchAt(grid, W, r, c, dir.dr, dir.dc, rows, cols)) {
            const cells = [];
            for (let i = 0; i < W.length; i++) {
              cells.push({ r: r + dir.dr * i, c: c + dir.dc * i });
            }
            results.push({
              word: W,
              startRow: r + 1,
              startCol: c + 1,
              direction: dir.name,
              cells,
            });
          }
        }
      }
    }
    return results;
  },

  _matchAt(grid, word, r, c, dr, dc, rows, cols) {
    for (let i = 0; i < word.length; i++) {
      const nr = r + dr * i;
      const nc = c + dc * i;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) return false;
      if (grid[nr][nc] !== word[i]) return false;
    }
    return true;
  },

  solveAll(gridInput, wordsInput) {
    const grid = this.parseGrid(gridInput);
    if (!grid.length || !grid[0].length) return { error: 'Invalid grid. Please check your input.' };

    const words = wordsInput.split(/[\n,]+/).map(w => w.trim().toUpperCase()).filter(w => w.length > 0);
    if (!words.length) return { error: 'Please enter at least one word to find.' };

    const allResults = [];
    const found = [];
    const notFound = [];
    const highlightMap = {}; // "r,c" -> [wordIndex...]

    words.forEach((word, wi) => {
      const matches = this.findWord(grid, word);
      if (matches && matches.length > 0) {
        found.push(word);
        matches.forEach(match => {
          allResults.push(match);
          match.cells.forEach(cell => {
            const key = `${cell.r},${cell.c}`;
            if (!highlightMap[key]) highlightMap[key] = [];
            if (!highlightMap[key].includes(wi)) highlightMap[key].push(wi);
          });
        });
      } else {
        notFound.push(word);
      }
    });

    return { grid, words, allResults, found, notFound, highlightMap };
  }
};

window.WordSearchEngine = WordSearchEngine;
