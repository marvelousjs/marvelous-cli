import { spawn } from 'child_process';

export const npmList = (cwd: string) => {
  return new Promise(resolve => {
    // create new daemon process
    const child = spawn('npm', ['--depth=0', 'list'], {
      cwd,
      stdio: ['ignore', process.stdout, process.stdout]
    });
    child.on('message', console.log);
    child.on('close', resolve);
  });
};
