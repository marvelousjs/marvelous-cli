import { spawn } from 'child_process';
import * as path from 'path';

export const npmUpdate = (cwd: string) => {
  return new Promise((resolve, reject) => {
    // create new daemon process
    const child = spawn('npm', ['update'], {
      cwd,
      stdio: ['ignore', process.stdout, process.stdout]
    });
    child.on('close', result => {
      if (result === 0) {
        const pkg = require(path.join(cwd, 'package.json'));
        if (!pkg.scripts.postinstall) {
          resolve(result);
          return;
        }
        const child = spawn('npm', ['run', 'postinstall'], {
          cwd,
          stdio: ['ignore', process.stdout, process.stdout]
        });
        child.on('close', result => {
          if (result === 0) {
            resolve(result);
          } else {
            reject(new Error('Unable to update repository.'));
          }
        });
      } else {
        reject(new Error('Unable to update repository.'));
      }
    });
  });
};
