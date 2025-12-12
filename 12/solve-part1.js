import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getRawData, nums, timer, newGrid } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv.length >= 2 && process.argv[2] === 'real';
consola.start(`Starting day ${day} (real: ${isReal})`);
const t = timer();

const blocks = getRawData()
  .trim()
  .split(/\r?\n\r?\n/)
  .map((block) => block.split(/\r?\n/));

const regions = blocks.pop();

const shapes = [];
for (const block of blocks) {
  block.shift();
  shapes.push(block.map((line) => line.split('')));
}

function flipHorizontal(grid) {
  return grid.map((row) => row.slice().reverse());
}

function flipVertical(grid) {
  return grid.slice().reverse();
}

function rotateRight(grid) {
  const size = grid.length;
  const newGrid = Array.from({ length: size }, () => Array(size).fill('.'));
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      newGrid[x][size - 1 - y] = grid[y][x];
    }
  }
  return newGrid;
}

function rotateTimes(grid, times) {
  let result = grid;
  for (let i = 0; i < times; i++) {
    result = rotateRight(result);
  }
  return result;
}

function grid_match(grid, shape, [x, y]) {
  const size = shape.length;
  for (let sy = 0; sy < size; sy++) {
    for (let sx = 0; sx < size; sx++) {
      if (shape[sy][sx] !== '.' && grid[y + sy][x + sx] !== '.') {
        return false;
      }
    }
  }
  return true;
}

const hash = (grid) => grid.map((row) => row.join('')).join('\n');

const possible = Array.from({ length: shapes.length }, () => []);
for (const [i, shape] of shapes.entries()) {
  const done = new Set();
  for (let flipH = 0; flipH <= 1; flipH++) {
    for (let flipV = 0; flipV <= 1; flipV++) {
      for (let rot = 0; rot < 4; rot++) {
        let testShape = shape;
        if (flipH) testShape = flipHorizontal(testShape);
        if (flipV) testShape = flipVertical(testShape);
        testShape = rotateTimes(testShape, rot);
        const k = hash(testShape);
        if (!done.has(k)) {
          done.add(k);
          possible[i].push(testShape);
        }
      }
    }
  }
}

function count(grid, val) {
  let cnt = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === val) cnt += 1;
    }
  }
  return cnt;
}

const SIZE = shapes[0].length;
function try_fit(gifts, grid) {
  // not enough space even with perfect packing
  const spaces = count(grid, '.');
  let needed = 0;
  for (const [g, countG] of gifts.entries()) {
    needed += count(shapes[g], '#') * countG;
  }
  if (needed > spaces) return false;

  // play tetris
  const idx = gifts.findIndex((n) => n > 0);
  if (idx < 0) return true;

  for (let y = 0; y <= grid.length - SIZE; y++) {
    for (let x = 0; x <= grid[0].length - SIZE; x++) {
      for (const shape of possible[idx]) {
        if (grid_match(grid, shape, [x, y])) {
          // temp place shape
          for (let sy = 0; sy < SIZE; sy++) {
            for (let sx = 0; sx < SIZE; sx++) {
              if (shape[sy][sx] !== '.') {
                grid[y + sy][x + sx] = '#';
              }
            }
          }
          gifts[idx] -= 1;

          if (try_fit(gifts, grid)) return true;

          gifts[idx] += 1;
          // remove shape
          for (let sy = 0; sy < SIZE; sy++) {
            for (let sx = 0; sx < SIZE; sx++) {
              if (shape[sy][sx] !== '.') {
                grid[y + sy][x + sx] = '.';
              }
            }
          }
        }
      }
    }
  }

  return false;
}

let answer = 0;
for (const region of regions) {
  const [a, b] = region.split(': ');
  const [size, gifts] = [a.split('x').map(Number), nums(b)];

  const nb_present = gifts.reduce((a, b) => a + b, 0);
  const h = Math.floor(size[0] / SIZE);
  const w = Math.floor(size[1] / SIZE);

  // largely enough space, no need to tetris
  if (nb_present <= h * w) {
    answer += 1;
    continue;
  }

  const grid = newGrid(size[0], size[1], '.');
  if (try_fit(gifts, grid)) answer += 1;
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
