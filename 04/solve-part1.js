import { consola } from 'consola';
import clipboard from 'clipboardy';
import { enumGrid, getCurrentDay, getDataLines, getGrid, getNeighbors, inGridRange, timer } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv.length >= 2 && process.argv[2] === 'real';
consola.start(`Starting day ${day} (real: ${isReal})`);
const t = timer();

const grid = getGrid(getDataLines());

let answer = 0;
for (const { x, y, cell } of enumGrid(grid)) {
  if (cell === '@') {
    const filled = getNeighbors(x, y).filter(([nx, ny]) => inGridRange(grid, nx, ny) && grid[ny][nx] === '@');
    if (filled.length < 4) answer++;
  }
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
