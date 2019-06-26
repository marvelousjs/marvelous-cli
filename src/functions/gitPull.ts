import { spawn } from 'child_process';

export const gitPull = (cwd: string) => {
  return new Promise(resolve => {
    // create new daemon process
    const child = spawn('git', ['pull', 'origin', 'master'], {
      cwd,
      stdio: ['ignore', process.stdout, process.stdout]
    });
    child.on('message', console.log);
    child.on('close', resolve);
  });
};
