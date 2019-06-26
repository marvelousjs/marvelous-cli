import { spawn } from 'child_process';

export const code = (cwd: string[]) => {
  return new Promise(resolve => {
    // create new daemon process
    const child = spawn('code', cwd);
    child.on('message', console.log);
    child.on('close', resolve);
  });
};
