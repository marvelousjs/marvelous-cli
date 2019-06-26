import { spawn } from 'child_process';
import * as path from 'path';

export const npmTest = (cwd: string) => {
  return new Promise(resolve => {
    // create new daemon process
    const pkg = require(path.join(cwd, 'package.json'));
    const testScript = pkg.scripts && pkg.scripts['test:all'] ? 'test:all' : 'test';
    const child = spawn('npm', ['run', testScript], {
      cwd,
      stdio: ['ignore', process.stdout, process.stdout]
    });
    child.on('message', console.log);
    child.on('close', resolve);
  });
};
