import * as fs from 'fs';
import * as path from 'path';
import { spawn } from 'child_process';
import { homedir } from 'os';
import { IAction } from '@marvelousjs/program';

interface IProps {
  name: string;
  type: string;
}

export const StartAction: IAction<IProps> = ({ name, type }) => {
  // get config file
  const platformConfigFile = path.join(homedir(), `.mvs/platforms/${name}.json`);

  // load config
  const platformConfig = (() => {
    try {
      return JSON.parse(fs.readFileSync(platformConfigFile, 'utf8'));
    } catch {
      return {};
    }
  })();

  // validate config
  if (typeof platformConfig !== 'object') {
    throw new Error(`Config file is corrupt, should be object: ${platformConfigFile}`);
  }

  ['apps', 'gateways', 'services'].forEach((type: 'apps' | 'gateways' | 'services') => {
    if (!platformConfig[type]) {
      return;
    }

    Object.keys(platformConfig[type]).forEach((objectName) => {
      const singularType = type.substr(0, type.length - 1);
      const repoName = `${name}-${singularType}-${objectName}`;

      console.log(`Starting ${repoName}...`);

      // get files
      const logFile = path.join(homedir(), `.mvs/logs/${repoName}.log`);
      const pidFile = path.join(homedir(), `.mvs/daemons/${repoName}.pid`);
  
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
  
      // process has already started
      if (fs.existsSync(pidFile)) {
        const currentPid = Number(fs.readFileSync(pidFile));
        throw new Error(`${repoName} has already been started (pid: ${currentPid})`);
      }
  
      // create new daemon process
      const child = spawn(
        'npm',
        ['run', 'start:dev'],
        {
          cwd: path.join(homedir(), 'Developer', name, repoName),
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
    });
  });
};
