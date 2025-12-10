import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, nums, timer } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv.length >= 2 && process.argv[2] === 'real';
consola.start(`Starting day ${day} (real: ${isReal})`);
const t = timer();

const nodes = getDataLines().map(nums);
let edges = [];
for (let i = 0; i < nodes.length; i++) {
  edges.push([...nodes[i], ...nodes[(i + 1) % nodes.length]]);
}
edges = edges.map(([a, b, c, d]) => [Math.min(a, c), Math.min(b, d), Math.max(a, c), Math.max(b, d)]);

let answer = 0;
for (let i = 0; i < nodes.length; i++) {
  const [a, b] = nodes[i];
  for (let j = i + 1; j < nodes.length; j++) {
    const [c, d] = nodes[j];
    const [x1, y1, x2, y2] = [Math.min(a, c), Math.min(b, d), Math.max(a, c), Math.max(b, d)];
    const size = (x2 - x1 + 1) * (y2 - y1 + 1); // size of rectangle
    if (size <= answer) continue;

    // skip if intersect with any edge
    let intersects = false;
    for (const [ex1, ey1, ex2, ey2] of edges) {
      if (ex2 > x1 && ey2 > y1 && ex1 < x2 && ey1 < y2) {
        intersects = true;
        break;
      }
    }
    if (intersects) continue;

    answer = size;
  }
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
