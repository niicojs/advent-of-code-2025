import { consola } from 'consola';
import clipboard from 'clipboardy';
import TinyQueue from 'tinyqueue';
import { getCurrentDay, getDataLines, nums, timer } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv.length >= 2 && process.argv[2] === 'real';
consola.start(`Starting day ${day} (real: ${isReal})`);
const t = timer();

const lines = getDataLines().map((l) => l.split(' '));

const key = (lights) => lights.join(',');

function search({ diagram, buttons }) {
  const state = Array.from({ length: diagram.length }).map(() => '.');
  const todo = new TinyQueue([{ lights: state, score: 0 }], (a, b) => a.score - b.score);
  const visited = new Set();
  while (todo.length > 0) {
    const { lights, score } = todo.pop();

    if (key(lights) === key(diagram)) return score;

    if (visited.has(key(lights))) continue;
    visited.add(key(lights));

    for (const switches of buttons) {
      const next = lights.slice();
      for (const idx of switches) next[idx] = next[idx] === '.' ? '#' : '.';
      todo.push({ lights: next, score: score + 1 });
    }
  }
}

let answer = 0;
for (const line of lines) {
  const diagram = line.shift().slice(1, -1).split('');
  const joltage = nums(line.pop());
  const buttons = line.map(nums);

  const pushes = search({ diagram, joltage, buttons });
  answer += pushes;
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
