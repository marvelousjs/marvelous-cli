import { spawn } from 'child_process';

export const npmUpdate = (cwd: string) => {
  return new Promise((resolve, reject) => {
    // create new daemon process
    const child = spawn('npm', ['update'], {
      stdio: ['ignore', process.stdout, process.stdout]
    });
    child.on('close', result => {
      if (result === 0) {
        resolve(result);
      } else {
        reject(new Error('Unable to update repository.'));
      }
    });
  });
};
