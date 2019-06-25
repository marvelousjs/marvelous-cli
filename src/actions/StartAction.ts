import * as fs from 'fs';
import * as path from 'path';
import { spawn } from 'child_process';
import { homedir } from 'os';
import { IAction } from '@marvelousjs/program';

import { loadConfig, parseType, random, saveConfig } from '../functions';

interface IProps {
  platformName: string;
  name?: string;
  type: string;
}

export const StartAction: IAction<IProps> = ({
  platformName,
  name = platformName,
  type
}) => {
  const typeParsed = parseType(type);
  if (typeParsed.singular !== 'all') {
    return;
  }

  // load config
  const config = loadConfig();

  if (!config.daemons) {
    config.daemons = [];
  }

  // load platform config
  const platformConfig = config.platforms[platformName];

  ['apps', 'gateways', 'services'].forEach((type: 'apps' | 'gateways' | 'services') => {
    if (!platformConfig[type]) {
      return;
    }

    Object.keys(platformConfig[type]).forEach((objectName) => {
      const singularType = type.substr(0, type.length - 1);
      const repoName = `${name}-${singularType}-${objectName}`;

      const currentDaemon = config.daemons.find(d => d.name === repoName);
      if (currentDaemon) {
        throw new Error(`${repoName} has already been started on port ${currentDaemon.port} (pid: ${currentDaemon.pid})`);
      }

      const randomPort = (() => {
        if (singularType === 'app') {
          return random(3100, 3999);
        }
        if (singularType === 'gateway') {
          return random(3100, 3999);
        }
        if (singularType === 'service') {
          return random(3100, 3999);
        }
      })();

      console.log(`Starting ${repoName} on port ${randomPort}...`);

      // get files
      const logFile = path.join(homedir(), `.mvs/logs/${repoName}.log`);
  
      // get/create log dir
      const logDir = path.dirname(logFile);
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }

      // create new daemon process
      const child = spawn(
        'npm',
        ['run', 'start:dev'],
        {
          cwd: path.join(platformConfig[type][objectName].dir),
          detached: true,
          env: {
            ...process.env,
            NODE_ENV: 'development',
            PROTOCOL: 'http',
            HOST: 'localhost',
            PORT: randomPort.toString()
          },
          stdio: ['ignore', fs.openSync(logFile, 'a'), fs.openSync(logFile, 'a')]
        }
      );
  
      try {
        if (config.daemons.find(d => d.port === randomPort)) {
          throw new Error(`Failed to generate random port. Please try again.`);
        }

        config.daemons.push({
          name: repoName,
          pid: child.pid,
          port: randomPort
        });
      } finally {
        child.unref();
      }
    });
  });

  saveConfig(config);
};
