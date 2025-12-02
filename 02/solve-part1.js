import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getRawData, timer } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv.length >= 2 && process.argv[2] === 'real';
consola.start(`Starting day ${day} (real: ${isReal})`);
const t = timer();

const values = getRawData()
  .trim()
  .split(',')
  .map((l) => l.split('-').map(Number));

function isValidPassword(n) {
  const s = n.toString();
  if (s.length % 2 !== 0) return true;
  const m = s.length / 2;
  return s.slice(0, m) !== s.slice(m);
}

let answer = 0;
for (const [start, end] of values) {
  for (let i = start; i <= end; i++) {
    if (!isValidPassword(i)) {
      consola.info(i);
      answer += i;
    }
  }
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
