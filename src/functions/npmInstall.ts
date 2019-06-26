import { spawn } from 'child_process';

export const npmInstall = (cwd: string) => {
  return new Promise(resolve => {
    // create new daemon process
    const child = spawn('npm', ['install'], {
      cwd,
      stdio: ['ignore', process.stdout, process.stdout]
    });
    child.on('message', console.log);
    child.on('close', resolve);
  });
};
