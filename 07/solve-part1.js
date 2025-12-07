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

let answer = 0;

let tachyons = new Set([sx]);
for (let y = 1; y < grid.length; y++) {
  const next = new Set();
  for (const x of tachyons) {
    if (grid[y][x] === '^') {
      answer++;
      if (x > 0) next.add(x - 1);
      if (x < grid[0].length - 1) next.add(x + 1);
    } else {
      next.add(x);
    }
  }
  tachyons = next;
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
