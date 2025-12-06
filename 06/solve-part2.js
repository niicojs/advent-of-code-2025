import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, timer } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv.length >= 2 && process.argv[2] === 'real';
consola.start(`Starting day ${day} (real: ${isReal})`);
const t = timer();

const lines = getDataLines();
const ops = lines.pop();
console.info(lines);

let answer = 0;
let [i, j, op_idx] = [lines[0].length - 1, 0, lines[0].length];
while (i >= 0) {
  op_idx--;
  while (!ops[op_idx] || ops[op_idx] === ' ') op_idx--;

  let vals = [];

  while (i >= 0) {
    let v = '';
    for (j = 0; j < lines.length; j++) if (lines[j][i] !== ' ') v += lines[j][i];
    i--;
    if (v === '') break;
    vals.push(+v);
  }

  let res = 0;
  if (ops[op_idx] === '+') {
    res = vals.reduce((a, b) => a + +b, 0);
  } else {
    res = vals.reduce((a, b) => a * +b, 1);
  }

  answer += res;
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
