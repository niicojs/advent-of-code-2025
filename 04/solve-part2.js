import { consola } from 'consola';
import clipboard from 'clipboardy';
import { enumGrid, getCurrentDay, getDataLines, getGrid, getNeighbors, inGridRange, timer } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv.length >= 2 && process.argv[2] === 'real';
consola.start(`Starting day ${day} (real: ${isReal})`);
const t = timer();

const grid = getGrid(getDataLines());

function get_rolls() {
  let removed = 0;
  for (const { x, y, cell } of enumGrid(grid)) {
    if (cell === '@') {
      const filled = getNeighbors(x, y).filter(([nx, ny]) => inGridRange(grid, nx, ny) && grid[ny][nx] === '@');
      if (filled.length < 4) {
        grid[y][x] = '.';
        removed++;
      }
    }
  }
  return removed;
}

let answer = 0;
while (true) {
  const removed = get_rolls();
  if (removed === 0) break;
  answer += removed;
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
