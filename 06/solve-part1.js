import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, timer } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv.length >= 2 && process.argv[2] === 'real';
consola.start(`Starting day ${day} (real: ${isReal})`);
const t = timer();

const lines = getDataLines().map((l) => l.split(/\s+/).filter(Boolean));
const ops = lines.pop();

let answer = 0;
for (let i = 0; i < lines[0].length; i++) {
  let res = ops[i] === '+' ? 0 : 1;
  for (let j = 0; j < lines.length; j++) {
    if (ops[i] === '+') {
      res += +lines[j][i];
    } else {
      res *= +lines[j][i];
    }
  }
  answer += res;
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
