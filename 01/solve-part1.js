import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, mod, timer } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv.length >= 2 && process.argv[2] === 'real';
consola.start(`Starting day ${day} (real: ${isReal})`);
const t = timer();

const lines = getDataLines();

const MAX = 100;
let safe = 50;
let answer = 0;

for (const line of lines) {
  const turn = line[0];
  const dist = +line.slice(1);
  if (turn === 'L') {
    safe = mod(safe - dist, MAX);
  } else {
    safe = mod(safe + dist, MAX);
  }
  if (safe === 0) answer++;
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
