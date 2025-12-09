import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, nums, timer } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv.length >= 2 && process.argv[2] === 'real';
consola.start(`Starting day ${day} (real: ${isReal})`);
const t = timer();

const values = getDataLines().map(nums);

const key = (a, b) => `${a},${b}`;
const edge = new Set();
// init edges
for (let i = 0; i < values.length - 1; i++) {
  const [a, b] = values[i];
  const [c, d] = values[i + 1];
  const x1 = Math.min(a, c);
  const y1 = Math.min(b, d);
  const x2 = Math.max(a, c);
  const y2 = Math.max(b, d);
  for (let x = x1; x <= x2; x++) {
    edge.add(key(x, y1));
    edge.add(key(x, y2));
  }
  for (let y = y1; y <= y2; y++) {
    edge.add(key(x1, y));
    edge.add(key(x2, y));
  }
}

const pnpoly = ([x, y]) => {
  if (edge.has(key(x, y))) return true;
  let [i, j, c] = [0, 0, false];
  for (i = 0, j = values.length - 1; i < values.length; j = i++) {
    if (
      values[i][1] > y !== values[j][1] > y &&
      x < ((values[j][0] - values[i][0]) * (y - values[i][1])) / (values[j][1] - values[i][1]) + values[i][0]
    )
      c = !c;
  }
  return c;
};

function all_inside([x1, y1], [x2, y2]) {
  for (let x = x1; x <= x2; x++) {
    if (!pnpoly([x, y1])) return false;
    if (!pnpoly([x, y2])) return false;
  }
  for (let y = y1; y <= y2; y++) {
    if (!pnpoly([x1, y])) return false;
    if (!pnpoly([x2, y])) return false;
  }
  return true;
}

let answer = 0;
for (let i = 0; i < values.length; i++) {
  const [a, b] = values[i];
  for (let j = i + 1; j < values.length; j++) {
    const [c, d] = values[j];
    const [x1, y1, x2, y2] = [Math.min(a, c), Math.min(b, d), Math.max(a, c), Math.max(b, d)];
    const size = (x2 - x1 + 1) * (y2 - y1 + 1);
    if (size <= answer) continue;
    if (!all_inside([x1, y1], [x2, y2])) continue;

    answer = size;
  }
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
