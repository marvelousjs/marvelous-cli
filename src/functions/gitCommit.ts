import { spawn } from 'child_process';

export const gitCommit = (cwd: string) => {
  return new Promise(resolve => {
    if (!process.env.MSG) {
      throw new Error(`'MSG' is required.`);
    }
    // create new daemon process
    const child = spawn('git', ['commit', '-m', process.env.MSG], {
      cwd,
      stdio: ['ignore', process.stdout, process.stdout]
    });
    child.on('message', console.log);
    child.on('close', resolve);
  });
};
