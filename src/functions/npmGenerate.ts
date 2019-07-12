import { spawn } from 'child_process';
import * as path from 'path';

export const npmGenerate = (cwd: string) => {
  return new Promise(resolve => {
    // create new daemon process
    const pkg = require(path.join(cwd, 'package.json'));
    const generateScript = pkg.scripts && pkg.scripts['generate:all'] ? 'generate:all' : 'generate';
    const child = spawn('npm', ['run', generateScript], {
      cwd,
      stdio: ['ignore', process.stdout, process.stdout]
    });
    child.on('message', console.log);
    child.on('close', resolve);
  });
};
