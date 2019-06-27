import { spawn } from 'child_process';
import * as path from 'path';

export const npmLink = (cwd: string) => {
  return new Promise(resolve => {
    // create new daemon process
    const pkg = require(path.join(cwd, 'package.json'));
    const linkScipt = pkg.scripts && pkg.scripts['link:all'] ? ['run', 'link:all'] : ['link'];
    const child = spawn('npm', linkScipt, {
      cwd,
      stdio: ['ignore', process.stdout, process.stdout]
    });
    child.on('message', console.log);
    child.on('close', resolve);
  });
};
