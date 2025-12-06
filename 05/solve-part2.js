import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getRawData, merge_ranges, timer } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv.length >= 2 && process.argv[2] === 'real';
consola.start(`Starting day ${day} (real: ${isReal})`);
const t = timer();

const [one] = getRawData()
  .trim()
  .split(/\r?\n\r?\n/);

const fresh = one.split(/\r?\n/).map((line) => line.split('-').map(Number));
const better = merge_ranges(fresh);

let answer = 0;
for (const [start, end] of better) {
  answer += end - start + 1;
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
