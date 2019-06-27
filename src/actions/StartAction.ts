import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';
import { spawn } from 'child_process';
import { homedir } from 'os';
import { IAction } from '@marvelousjs/program';

import { loadConfig, parseType, random, saveConfig, toArtifactArray, parseEnvVar } from '../functions';

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

  const envMapping: any = {};
  const portMapping: any = {};
  artifacts.forEach(artifact => {
    // tools NEVER start
    if (artifact.type === 'tool') {
      return;
    }
    
    const randomPort = (() => {
      if (artifact.type === 'app') {
        return random(8100, 8999);
      }
      if (artifact.type === 'gateway') {
        return random(4100, 4999);
      }
      if (artifact.type === 'service') {
        return random(3100, 3999);
      }
    })();

    envMapping[`${parseEnvVar(artifact.repo.name)}_URL`] = `http://localhost:${randomPort}`;
    portMapping[artifact.repo.name] = randomPort;
  });

  artifacts.forEach(artifact => {
    // tools NEVER start
    if (artifact.type === 'tool') {
      return;
    }

    console.log(chalk.bold(`Starting ${artifact.name} ${artifact.type} on port ${portMapping[artifact.repo.name]}...`));

    const artifactDir = path.join(homedir(), 'Developer', platformName, artifact.repo.name);
    if (!fs.existsSync(artifactDir)) {
      console.log(chalk.yellow(`Directory does not exist. Try '${platformName} clone ${artifact.type} ${artifact.name}'.`));
      return;
    }

    // get files
    const logFile = path.join(homedir(), `.mvs/logs/${platformName}/${artifact.repo.name}.log`);

    // get/create log dir
    const logDir = path.dirname(logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const currentDaemon = config.daemons.find(d => d.name === artifact.repo.name);
    if (currentDaemon) {
      console.log(
        chalk.yellow(
          `${artifact.repo.name} has already been started on port ${currentDaemon.port} (pid: ${
            currentDaemon.pid
          })`
        )
      );
    }

    const env = {
      ...process.env,
      NODE_ENV: 'development',
      ...envMapping
    };
      
    // create new daemon process
    const child = spawn('npm', ['run', 'start:dev'], {
      cwd: path.join(homedir(), 'Developer', platformName, artifact.repo.name),
      detached: true,
      env,
      stdio: ['ignore', fs.openSync(logFile, 'a'), fs.openSync(logFile, 'a')]
    });

    try {
      if (config.daemons.find(d => d.port === portMapping[artifact.repo.name])) {
        throw new Error(`Failed to generate random port. Please try again.`);
      }

      config.daemons.push({
        name: artifact.repo.name,
        pid: child.pid,
        port: portMapping[artifact.repo.name],
        env
      });
    } finally {
      child.unref();
    }
  });

  saveConfig(config);
};
