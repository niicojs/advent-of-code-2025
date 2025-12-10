import { consola } from 'consola';
import clipboard from 'clipboardy';
import { init as z3_init } from 'z3-solver';
import { getCurrentDay, getDataLines, nums, timer } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv.length >= 2 && process.argv[2] === 'real';
consola.start(`Starting day ${day} (real: ${isReal})`);
const t = timer();

const lines = getDataLines().map((l) => l.split(' '));

const { Context } = await z3_init();
const { Int, Optimize } = new Context('main');

async function solve({ joltage, buttons }) {
  const solver = new Optimize();
  let sum = null;
  const pushes = buttons.map((_, i) => {
    const x = Int.const(`button_${i}`);
    solver.add(x.ge(0));
    if (!sum) sum = x;
    else sum = sum.add(x);
    return x;
  });
  for (let i = 0; i < joltage.length; i++) {
    let val = null;
    for (let j = 0; j < buttons.length; j++) {
      if (buttons[j].includes(i)) {
        if (!val) val = pushes[j];
        else val = val.add(pushes[j]);
      }
    }

    solver.minimize(sum);
    if (val) solver.add(val.eq(joltage[i]));
    else throw new Error('Wut?');
  }

  await solver.check();
  const model = await solver.model();
  let result = 0;
  for (const p of pushes) {
    // console.log(model.eval(p).asString());
    result += +model.eval(p).asString();
  }
  return result;
}

let answer = 0;
for (const line of lines) {
  const diagram = line.shift().slice(1, -1).split('');
  const joltage = nums(line.pop());
  const buttons = line.map(nums);

  const pushes = await solve({ diagram, joltage, buttons });
  // consola.info('pushes', pushes);
  answer += pushes;
}

// 20681 too high

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
