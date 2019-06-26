import { spawn } from 'child_process';

export const npmLink = (cwd: string) => {
  return new Promise(resolve => {
    // create new daemon process
    const child = spawn('npm', ['link'], {
      cwd,
      stdio: ['ignore', process.stdout, process.stdout]
    });
    child.on('message', console.log);
    child.on('close', resolve);
  });
};
