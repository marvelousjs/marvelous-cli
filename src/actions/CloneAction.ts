import * as forEach from 'p-map';
import * as fs from 'fs';
import * as path from 'path';
import { IAction } from '@marvelousjs/program';

import { loadConfig, formatPath, gitClone, saveConfig, toArtifactArray } from '../functions';
import { homedir } from 'os';
import chalk from 'chalk';

interface IProps {
  cliConfig: any;
  platformName: string;
  typeFilter: string;
  nameFilter?: string;
}

export const CloneAction: IAction<IProps> = async ({
  cliConfig = {},
  platformName,
  typeFilter,
  nameFilter = ''
}) => {
  // load config
  const config = loadConfig();

  const artifacts = toArtifactArray(cliConfig, { name: nameFilter, type: typeFilter });

  await forEach(artifacts, async (artifact) => {
    const from = `git@${artifact.repo.host}${artifact.repo.path.replace(/^\//, ':')}`;
    const to = path.join(homedir(), 'Developer', platformName, artifact.repo.name);

    if (fs.existsSync(to)) {
      console.log(chalk.yellow(`Directory already exists: ${formatPath(to)}`));
      return;
    }  

    console.log(chalk.bold(`Cloning from '${from}'...`));

    await gitClone(to, from);

  }, { concurrency: 1 });

  saveConfig(config);
};
