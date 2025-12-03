import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, timer } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv.length >= 2 && process.argv[2] === 'real';
consola.start(`Starting day ${day} (real: ${isReal})`);
const t = timer();

const banks = getDataLines();

let answer = 0;
for (const bank of banks) {
  const batteries = bank.split('').map(Number);
  let best = 0;
  for (let i = 0; i < batteries.length; i++) {
    for (let j = i + 1; j < batteries.length; j++) {
      const v = +(batteries[i].toString() + batteries[j].toString());
      best = Math.max(best, v);
    }
  }
  answer += best;
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
