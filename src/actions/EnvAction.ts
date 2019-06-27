import chalk from 'chalk';
import * as fs from 'fs';
import { homedir } from 'os';
import * as path from 'path';
import * as forEach from 'p-map';
import { IAction } from '@marvelousjs/program';

import { loadConfig, saveConfig, toArtifactArray, parseType, formatPath } from '../functions';

interface IProps {
  cliConfig: any;
  platformName: string;
  typeFilter: string;
  nameFilter: string;
}

export const EnvAction: IAction<IProps> = async ({
  cliConfig,
  platformName,
  typeFilter,
  nameFilter
}) => {
  // load config
  const config = loadConfig();

  const artifacts = toArtifactArray(cliConfig, { name: nameFilter, type: parseType(typeFilter).singular });

  if (typeFilter === 'all') {
    const envToolDir = path.join(homedir(), 'Developer', platformName, `${platformName.substr(1)}-env`);
    const envTool = require(envToolDir);
      
    console.log(chalk.bold('Available Environment Variables...'));
    Object.values(envTool).forEach((value) => {
      console.log(`- ${value}`);
    });
  }

  await forEach(artifacts, async artifact => {
    const envDir = path.join(homedir(), 'Developer', platformName, artifact.repo.name);

    console.log(chalk.bold(`Environment Varilables for '${formatPath(envDir)}'...`));

    if (!fs.existsSync(envDir)) {
      console.log(chalk.yellow(`Directory does not exist. Try '${platformName} clone ${artifact.type} ${artifact.name}'.`));
      return;
    }

    const envFile = path.join(envDir, 'dist/env.js');

    if (!fs.existsSync(envFile)) {
      console.log(chalk.yellow(`'dist/env.js' does not exist for '${formatPath(envDir)}'.`));
      return;
    }

    const oldConsoleLog = console.log;

    try {
      console.log = () => {};
      const { env, envMapping } = require(envFile);
      console.log = oldConsoleLog;

      Object.entries(env).forEach(([name, value]: [string, string]) => {
        if (envMapping[name] === 'NODE_ENV') {
          value = 'development';
        } else if (envMapping[name] === `${artifact.repo.name.toUpperCase().replace(/-/g, '_')}_URL`) {
          const currentDaemon = config.daemons.find(d => d.name === artifact.repo.name);
          if (currentDaemon) {
            value = `http://localhost:${currentDaemon.port}`;
          }
        }
        
        if (value === undefined) {
          value = chalk.gray('(undefined)');
        } else if (value.length === 0) {
          value = chalk.gray('(empty)');
        }
        
        console.log(`${envMapping[name]} -> ${name}: ${value}`);
      });

    } catch (error) {
      console.log = oldConsoleLog;
      console.log(chalk.red(`ERROR: ${error.message}`));
    }

  }, { concurrency: 1 });

  saveConfig(config);
};
