import { spawn } from 'child_process';

export const gitClone = (cwd: string, url: string) => {
  return new Promise((resolve, reject) => {
    // create new daemon process
    const child = spawn('git', ['clone', url, cwd], {
      stdio: ['ignore', process.stdout, process.stdout]
    });
    child.on('close', result => {
      if (result === 0) {
        resolve(result);
      } else {
        reject(new Error('Unable to clone repository.'));
      }
    });
  });
};
