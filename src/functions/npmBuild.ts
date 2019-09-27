import { spawn } from 'child_process';
import * as path from 'path';

export const npmBuild = (cwd: string, envMapping = {}) => {
  return new Promise(resolve => {
    // create new daemon process
    const pkg = require(path.join(cwd, 'package.json'));
    const buildScript = pkg.scripts && pkg.scripts['build:dev'] ? 'build:dev' : 'build';
    console.log(envMapping);
    const child = spawn('npm', ['run', buildScript], {
      cwd,
      env: {
        ...process.env,
        ...envMapping
      },
      stdio: ['ignore', process.stdout, process.stdout]
    });
    child.on('message', console.log);
    child.on('close', resolve);
  });
};
