import * as fs from 'fs';
import * as path from 'path';
import { spawn } from 'child_process';
import { homedir } from 'os';

export const startAction = () => {
  // get files
  const logFile = path.join(homedir(), '.mvs/logs/marvelous-service-daemon.log');
  const pidFile = path.join(homedir(), '.mvs/daemons/marvelous-service-daemon.pid');

  // get/create log dir
  const logDir = path.dirname(logFile);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  // get/create pid dir
  const pidDir = path.dirname(pidFile);
  if (!fs.existsSync(pidDir)) {
    fs.mkdirSync(pidDir, { recursive: true });
  }

  // kill any existing marvelous-service-daemon processes
  if (fs.existsSync(pidFile)) {
    const currentPid = Number(fs.readFileSync(pidFile));
    throw new Error(`Marvelous has already been started (pid: ${currentPid})`);
  }

  // create new daemon process
  const child = spawn(
    'node',
    [path.normalize('./node_modules/@marvelousjs/service-daemon/dist/scripts/start.js')],
    {
      detached: true,
      env: {
        ...process.env,
        NODE_ENV: 'development'
      },
      stdio: ['ignore', fs.openSync(logFile, 'a'), fs.openSync(logFile, 'a')]
    }
  );

  // store pid of new process
  fs.writeFileSync(pidFile, `${child.pid}\n`);

  // unreference child process so "start" action can close
  child.unref();
};
