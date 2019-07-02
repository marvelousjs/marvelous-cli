import * as deasync from 'deasync';
import { exec } from 'child_process';

const execSync = deasync(exec);

export const isRunning = (pid: number) => {
  if (!pid || pid === -1) {
    return false;
  }
  try {
    execSync(`kill -s 0 ${pid}`);
    return true;
  } catch {}

  return false;
};
