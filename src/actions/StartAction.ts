import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';
import { spawn } from 'child_process';
import { homedir } from 'os';
import { IAction } from '@marvelousjs/program';

import { loadConfig, parseType, random, saveConfig, toArtifactArray } from '../functions';

interface IProps {
  cliConfig: any;
  platformName: string;
  typeFilter: string;
  nameFilter: string;
}

export const StartAction: IAction<IProps> = ({
  cliConfig,
  platformName,
  typeFilter,
  nameFilter
}) => {
  // load config
  const config = loadConfig();

  if (!config.daemons) {
    config.daemons = [];
  }

  const artifacts = toArtifactArray(cliConfig, {
    name: nameFilter,
    type: parseType(typeFilter).singular
  });

  artifacts.forEach(artifact => {
    const artifactDir = path.join(homedir(), 'Developer', platformName, artifact.repo.name);
    if (!fs.existsSync(artifactDir)) {
      throw new Error(`Directory does not exist. Try '${platformName} clone ${artifact.type} ${artifact.name}'.`);
    }
  });

  artifacts.forEach(artifact => {
    const currentDaemon = config.daemons.find(d => d.name === artifact.repo.name);
    if (currentDaemon) {
      throw new Error(
        `${artifact.repo.name} has already been started on port ${currentDaemon.port} (pid: ${
          currentDaemon.pid
        })`
      );
    }

    const randomPort = (() => {
      if (artifact.type === 'app') {
        return random(3100, 3999);
      }
      if (artifact.type === 'gateway') {
        return random(3100, 3999);
      }
      if (artifact.type === 'service') {
        return random(3100, 3999);
      }
    })();

    console.log(chalk.bold(`Starting ${artifact.name} ${artifact.type} on port ${randomPort}...`));

    // get files
    const logFile = path.join(homedir(), `.mvs/logs/${platformName}/${artifact.repo.name}.log`);

    // get/create log dir
    const logDir = path.dirname(logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    // create new daemon process
    const child = spawn('npm', ['run', 'start:dev'], {
      cwd: path.join(homedir(), 'Developer', platformName, artifact.repo.name),
      detached: true,
      env: {
        ...process.env,
        NODE_ENV: 'development',
        PROTOCOL: 'http',
        HOST: 'localhost',
        PORT: randomPort.toString()
      },
      stdio: ['ignore', fs.openSync(logFile, 'a'), fs.openSync(logFile, 'a')]
    });

    try {
      if (config.daemons.find(d => d.port === randomPort)) {
        throw new Error(`Failed to generate random port. Please try again.`);
      }

      config.daemons.push({
        name: artifact.repo.name,
        pid: child.pid,
        port: randomPort
      });
    } finally {
      child.unref();
    }
  });

  saveConfig(config);
};
