import { spawn } from 'child_process';
import * as path from 'path';

export const npmUnlink = (cwd: string) => {
  return new Promise(resolve => {
    // create new daemon process
    const pkg = require(path.join(cwd, 'package.json'));
    const linkScipt = pkg.scripts && pkg.scripts['unlink:all'] ? ['run', 'unlink:all'] : ['unlink'];
    const child = spawn('npm', linkScipt, {
      cwd,
      stdio: ['ignore', process.stdout, process.stdout]
    });
    child.on('message', console.log);
    child.on('close', resolve);
  });
};
