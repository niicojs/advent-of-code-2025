import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, nums, timer } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv.length >= 2 && process.argv[2] === 'real';
consola.start(`Starting day ${day} (real: ${isReal})`);
const t = timer();

const values = getDataLines().map(nums);

function rectangle_size([a, b], [c, d]) {
  const x1 = Math.min(a, c);
  const y1 = Math.min(b, d);
  const x2 = Math.max(a, c);
  const y2 = Math.max(b, d);
  return (x2 - x1 + 1) * (y2 - y1 + 1);
}

let answer = 0;
for (let i = 0; i < values.length; i++) {
  for (let j = i + 1; j < values.length; j++) {
    const size = rectangle_size(values[i], values[j]);
    if (size > answer) {
      answer = size;
    }
  }
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
