import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';
import { spawn } from 'child_process';
import { homedir } from 'os';
import { IAction } from '@marvelousjs/program';

import { isRunning, loadConfig, parseType, random, saveConfig, toArtifactArray, parseEnvVar } from '../functions';

interface IProps {
  cliConfig: any;
  platformName: string;
  typeFilter: string;
  nameFilter: string;
}

export const StartAction: IAction<IProps> = async ({
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
  const unfilteredArtifacts = toArtifactArray(cliConfig);

  const envMapping: any = {};
  const portMapping: any = {};
  unfilteredArtifacts.forEach(artifact => {
    // tools NEVER start
    if (artifact.type === 'tool') {
      return;
    }
    
    let port = 0;
    const currentDaemon = config.daemons.find(d => d.name === artifact.repo.name);
    if (process.env[`${parseEnvVar(artifact.repo.name)}_URL`]) {
      port = Number(process.env[`${parseEnvVar(artifact.repo.name)}_URL`].split(':').slice(-1)[0]);
      if (isNaN(port)) {
        if (/^https:/i.test(process.env[`${parseEnvVar(artifact.repo.name)}_URL`])) {
          port = 443;
        } else {
          port = 80;
        }
      }
    } else if (currentDaemon) {
      port = currentDaemon.port;
    } else {
      port = (() => {
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
    }

    if (process.env[`${parseEnvVar(artifact.repo.name)}_URL`]) {
      envMapping[`${parseEnvVar(artifact.repo.name)}_URL`] = process.env[`${parseEnvVar(artifact.repo.name)}_URL`];
    } else {
      envMapping[`${parseEnvVar(artifact.repo.name)}_URL`] = `http://localhost:${port}`;
    }
    portMapping[artifact.repo.name] = port;
  });

  artifacts.forEach(artifact => {
    // tools NEVER start
    if (artifact.type === 'tool') {
      return;
    }

    console.log(chalk.bold(`Starting ${artifact.name} ${artifact.type} on port ${portMapping[artifact.repo.name]}...`));

    const artifactDir = path.join(homedir(), 'Developer', platformName, artifact.repo.name);
    const isCloned = fs.existsSync(artifactDir);
    const isInstalled = fs.existsSync(path.join(artifactDir, 'node_modules'));
    const isBuilt = fs.existsSync(path.join(artifactDir, 'dist'));

    if (!isCloned) {
      console.log(chalk.yellow(`Directory does not exist. Try '${platformName} clone ${artifact.type} ${artifact.name}'.`));
      return;
    } else if (!isInstalled) {
      console.log(chalk.yellow(`'node_modules/' does not exist. Try '${platformName} install ${artifact.type} ${artifact.name}'.`));
      return;
    } else if (!isBuilt) {
      console.log(chalk.yellow(`'dist/' does not exist. Try '${platformName} build ${artifact.type} ${artifact.name}'.`));
      return;
    }

    // get files
    const logFile = path.join(homedir(), `.mvs/logs/${platformName}/${artifact.repo.name}.log`);

    // get/create log dir
    const logDir = path.dirname(logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const currentDaemonIndex = config.daemons.findIndex(d => d.name === artifact.repo.name);
    const currentDaemon = currentDaemonIndex > -1 ? config.daemons[currentDaemonIndex] : {};

    if (currentDaemonIndex !== -1 && isRunning(currentDaemon.pid)) {
      console.log(
        chalk.yellow(
          `${artifact.repo.name} has already been started on port ${currentDaemon.port} (pid: ${
            currentDaemon.pid
          })`
        )
      );
      return;
    }

    const env = {
      NODE_ENV: 'development',
      ...process.env,
      ...envMapping
    };

    // create new daemon process
    const cwd = path.join(homedir(), 'Developer', platformName, artifact.repo.name);
    const pkg = require(path.join(cwd, 'package.json'));
    const startScript = pkg.scripts && pkg.scripts['start:dev'] ? 'start:dev' : 'start';
    const child = spawn('npm', ['run', startScript], {
      cwd: path.join(homedir(), 'Developer', platformName, artifact.repo.name),
      detached: true,
      env,
      stdio: ['ignore', fs.openSync(logFile, 'a'), fs.openSync(logFile, 'a')]
    });

    try {
      if (config.daemons.find(d => d.port === portMapping[artifact.repo.name] && artifact.repo.name !== d.name)) {
        throw new Error(`Failed to generate random port. Please try again.`);
      }

      if (currentDaemonIndex !== -1) {
        config.daemons[currentDaemonIndex].env = env;
        config.daemons[currentDaemonIndex].pid = child.pid;
      } else {
        config.daemons.push({
          name: artifact.repo.name,
          pid: child.pid,
          port: portMapping[artifact.repo.name],
          env
        });
      }
    } finally {
      child.unref();
    }

    saveConfig(config);
  });
};
