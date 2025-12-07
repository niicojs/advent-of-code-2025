import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, getGrid, timer } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv.length >= 2 && process.argv[2] === 'real';
consola.start(`Starting day ${day} (real: ${isReal})`);
const t = timer();

let sx = 0;
const grid = getGrid(getDataLines());
for (let i = 0; i < grid[0].length; i++) if (grid[0][i] === 'S') sx = i;

let tachyons = new Map([[sx, 1]]);
for (let y = 1; y < grid.length; y++) {
  const next = new Map();
  for (const [x, nb] of tachyons.entries()) {
    if (grid[y][x] === '^') {
      if (x > 0) next.set(x - 1, nb + (next.get(x - 1) ?? 0));
      if (x < grid[0].length - 1) next.set(x + 1, nb + (next.get(x + 1) ?? 0));
    } else {
      next.set(x, nb + (next.get(x) ?? 0));
    }
  }
  tachyons = next;
}

let answer = tachyons.values().reduce((a, b) => a + b, 0);

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
