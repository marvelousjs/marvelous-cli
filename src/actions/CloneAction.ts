import { spawn } from 'child_process';
import * as fs from 'fs';
import * as forEach from 'p-map';
import * as path from 'path';
import { IAction } from '@marvelousjs/program';

import { loadConfig, saveConfig, toArtifactArray } from '../functions';
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

  const artifacts = toArtifactArray(cliConfig, { name: nameFilter, type: typeFilter });

  await forEach(artifacts, async (artifact) => {
    const from = `https://${artifact.repo.host}${artifact.repo.path}`;
    const to = path.join(homedir(), 'Developer', platformName, artifact.repo.name);

    console.log(chalk.blue(`Cloning from '${from}'...`));

    await gitClone(to, from);

  }, { concurrency: 1 });

  console.log(chalk.green('Done.'));

  saveConfig(config);
};
