import * as fs from 'fs';
import * as path from 'path';
import { homedir } from 'os';

export const stopAction = () => {
  // get pid file
  const pidFile = path.join(homedir(), '.mvs/daemons/marvelous-service-daemon.pid');

  // kill any existing marvelous-service-daemon processes
  if (fs.existsSync(pidFile)) {
    const currentPid = Number(fs.readFileSync(pidFile));

    try {
      process.kill(currentPid);
    } catch {}

    fs.unlinkSync(pidFile);
  }
};
