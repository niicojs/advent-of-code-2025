import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, timer, memoize } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv.length >= 2 && process.argv[2] === 'real';
consola.start(`Starting day ${day} (real: ${isReal})`);
const t = timer();

const path = new Map();
const lines = getDataLines().map((l) => l.split(': '));
for (const [a, b] of lines) {
  path.set(a, b.split(' '));
}

const follow = memoize((start, fft, dac) => {
  let res = 0;
  for (const out of path.get(start) || []) {
    if (out === 'out') {
      if (fft && dac) res++;
    } else {
      if (start === 'fft') fft = true;
      if (start === 'dac') dac = true;
      res += follow(out, fft, dac);
    }
  }
  return res;
});

let answer = follow('svr', false, false);

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
