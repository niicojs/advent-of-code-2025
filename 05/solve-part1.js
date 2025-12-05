import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getRawData, timer } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv.length >= 2 && process.argv[2] === 'real';
consola.start(`Starting day ${day} (real: ${isReal})`);
const t = timer();

const [one, two] = getRawData()
  .trim()
  .split(/\r?\n\r?\n/);

const fresh = one.split(/\r?\n/).map((line) => line.split('-').map(Number));
const ingredients = two.split(/\r?\n/).map(Number);

function is_fresh(ingredient) {
  for (const [low, high] of fresh) {
    if (ingredient >= low && ingredient <= high) return true;
  }
  return false;
}

let answer = 0;
for (const ingredient of ingredients) {
  if (is_fresh(ingredient)) answer++;
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
