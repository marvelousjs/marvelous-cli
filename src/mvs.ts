import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';

import {
  addAction,
  downAction,
  listAction,
  removeAction,
  runAction,
  startAction,
  stopAction,
  upAction
} from './actions';

if (process.argv.includes('--verbose')) {
  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf-8'));

  console.log(`mvs v${pkg.version}`);
}

const actions = {
  add: addAction,
  down: downAction,
  list: listAction,
  remove: removeAction,
  run: runAction,
  start: startAction,
  stop: stopAction,
  up: upAction
};

const action = process.argv[2] as ('add' | 'down' | 'list' | 'remove' | 'run' | 'start' | 'stop' | 'up');

if (!actions[action]) {
  console.log('Usage: mvs <add|down|list|remove|run|start|stop|up>');
  process.exit(0);
}

try {
  actions[action]();
} catch (error) {
  console.log(chalk.red(`ERROR: ${error.message}`));
  process.exit(1);
}
