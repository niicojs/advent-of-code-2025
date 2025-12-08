import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, nums, timer } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv.length >= 2 && process.argv[2] === 'real';
consola.start(`Starting day ${day} (real: ${isReal})`);
const t = timer();

const values = getDataLines().map(nums);

const dist = ([x1, y1, z1], [x2, y2, z2]) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2);

const dists = [];
for (let i = 0; i < values.length; i++) {
  for (let j = i + 1; j < values.length; j++) {
    const d = dist(values[i], values[j]);
    dists.push({ from: i, to: j, dist: d });
  }
}

dists.sort((a, b) => a.dist - b.dist);

const TODO = isReal ? 1000 : 10;

let circuits = [];
let connexions = 0;
while (connexions < TODO) {
  const { from, to } = dists.shift();
  let found = [];
  for (const [idx, circuit] of circuits.entries()) {
    if (circuit.has(from)) {
      found.push(idx);
    }
    if (circuit.has(to)) {
      found.push(idx);
    }
  }
  if (found.length === 0) {
    // not found, create a new circuit
    circuits.push(new Set([from, to]));
  } else if (found.length === 1) {
    // one found
    const idx = found[0];
    circuits[idx].add(from);
    circuits[idx].add(to);
  } else if (found.length === 2 && found[0] !== found[1]) {
    // merge circuits
    const [idx1, idx2] = found.toSorted((a, b) => a - b);
    const circuit2 = circuits.splice(idx2, 1)[0];
    circuits[idx1] = circuits[idx1].union(circuit2);
  }
  connexions++;
}

circuits.sort((a, b) => b.size - a.size);

let answer = 1;
for (let i = 0; i < 3; i++) {
  answer *= circuits[i].size;
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
