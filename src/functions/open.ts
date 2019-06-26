import { spawn } from 'child_process';

export const open = (cwd: string) => {
  return new Promise(resolve => {
    // create new daemon process
    const child = spawn('open', [cwd]);
    child.on('message', console.log);
    child.on('close', resolve);
  });
};
