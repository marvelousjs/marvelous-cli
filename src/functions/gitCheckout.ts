import { spawn } from 'child_process';

export const gitCheckout = (cwd: string, branch = 'master') => {
  return new Promise(resolve => {
    // create new daemon process
    const child = spawn('git', ['checkout', branch], {
      cwd,
      stdio: ['ignore', process.stdout, process.stdout]
    });
    child.on('message', console.log);
    child.on('close', resolve);
  });
};
