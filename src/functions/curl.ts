import { spawn } from 'child_process';

export const curl = (url: string) => {
  return new Promise(resolve => {
    // create new daemon process
    const child = spawn('curl', [`-X${process.env.METHOD || 'GET'}`, `${url}${process.env.URI || ''}`], {
      stdio: ['ignore', process.stdout, process.stdout]
    });
    child.on('message', console.log);
    child.on('close', resolve);
  });
};
