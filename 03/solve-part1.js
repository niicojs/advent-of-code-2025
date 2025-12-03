import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, memoize, timer } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv.length >= 2 && process.argv[2] === 'real';
consola.start(`Starting day ${day} (real: ${isReal})`);
const t = timer();

const banks = getDataLines();

const findBest = memoize((batteries, size) => {
  if (size === 0 || batteries.length < size) return 0n;
  let best = 0n;
  for (let i = 0; i <= batteries.length - size; i++) {
    const val = BigInt(batteries[i]) * 10n ** BigInt(size - 1) + findBest(batteries.slice(i + 1), size - 1);
    if (val > best) best = val;
  }
  return best;
});

let answer = 0n;
for (const bank of banks) {
  const batteries = bank.split('').map(Number);
  answer += findBest(batteries, 12);
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
