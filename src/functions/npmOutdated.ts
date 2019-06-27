import { spawn } from 'child_process';

export const npmOutdated = (cwd: string) => {
  return new Promise(resolve => {
    // create new daemon process
    const child = spawn('npm', ['outdated'], {
      cwd,
      stdio: ['ignore', process.stdout, process.stdout]
    });
    child.on('message', console.log);
    child.on('close', resolve);
  });
};
