import { spawn } from 'child_process';
import * as fs from 'fs';
import * as forEach from 'p-map';
import * as path from 'path';
import { IAction } from '@marvelousjs/program';

import { loadConfig, saveConfig } from '../functions';
import { homedir } from 'os';
import chalk from 'chalk';

interface IProps {
  cliConfig: any;
  platformName: string;
  typeFilter: string;
  nameFilter?: string;
}

const gitClone = (cwd: string, url: string) => {
  if (fs.existsSync(cwd)) {
    throw new Error(`Directory already exists: ${cwd}`);
  }
  return new Promise((resolve, reject) => {
    // create new daemon process
    const child = spawn(
      'git',
      ['clone', url, cwd],
      {
        stdio: ['ignore', process.stdout, process.stdout]
      }
    );
    child.on('close', result => {
      if (result === 0) {
        resolve(result);
      } else {
        reject(new Error('Unable to clone repository.'));
      }
    });
  });
}

export const CloneAction: IAction<IProps> = async ({
  cliConfig = {},
  platformName,
  typeFilter,
  nameFilter = ''
}) => {
  // load config
  const config = loadConfig();

  if (!config.platforms) {
    config.platforms = {};
  }

  if (!config.platforms[platformName]) {
    throw new Error(`Platform does not exist: ${platformName}`);
  }

  const apps = Object.entries(cliConfig.apps)
    .map(([name, app]) => {
      return [name, {
        ...app,
        type: 'app'
      }];
    });
  
  const gateways = Object.entries(cliConfig.gateways)
    .map(([name, app]) => {
      return [name, {
        ...app,
        type: 'gateway'
      }];
    });

  const services = Object.entries(cliConfig.services)
    .map(([name, app]) => {
      return [name, {
        ...app,
        type: 'service'
      }];
    });

  const things = apps.concat(gateways).concat(services)
    .filter(([name, thing]: [string, any]) => {
      if (
        (typeFilter === 'all' || typeFilter === thing.type)
        &&
        (nameFilter === '' || nameFilter === name)
      ) {
        return true;
      }
      return false;
    });

  await forEach(things, async ([name, thing]: any) => {
    const from = `https://${thing.repo.host}${thing.repo.path}`;
    const to = path.join(homedir(), 'Developer', platformName, thing.repo.name);

    console.log(chalk.blue(`Cloning from '${from}'...`));

    await gitClone(to, from);

  }, { concurrency: 1 });

  console.log(chalk.green('Done.'));

  saveConfig(config);
};
