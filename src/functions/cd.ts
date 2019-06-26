import { spawn } from 'child_process';

export const cd = (cwd: string) => {
  return new Promise(resolve => {
    // create new daemon process
    const child = spawn('zsh', ['-i'], { cwd, stdio: 'inherit' });
    child.on('message', console.log);
    child.on('close', resolve);
  });
};
