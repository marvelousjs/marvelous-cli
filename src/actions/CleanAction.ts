import chalk from 'chalk';
import * as fs from 'fs-extra';
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

export const CleanAction: IAction<IProps> = async ({
  cliConfig,
  platformName,
  typeFilter,
  nameFilter
}) => {
  // load config
  const config = loadConfig();

  const artifacts = toArtifactArray(cliConfig, { name: nameFilter, type: parseType(typeFilter).singular });

  await forEach(artifacts, async artifact => {
    const cleanDir = path.join(homedir(), 'Developer', platformName, artifact.repo.name);

    console.log(chalk.bold(`Cleaning '${formatPath(cleanDir)}'...`));

    if (!fs.existsSync(cleanDir)) {
      console.log(chalk.yellow(`Directory does not exist. Try '${platformName} clone ${artifact.type} ${artifact.name}'.`));
      return;
    }

    const distDir = path.join(cleanDir, 'dist');
    const nodeModulesDir = path.join(cleanDir, 'node_modules');

    console.log(chalk.gray(`Deleting '${formatPath(distDir)}'...`));
    await fs.removeSync(distDir);

    console.log(chalk.gray(`Deleting '${formatPath(nodeModulesDir)}'...`));
    await fs.removeSync(nodeModulesDir);

  }, { concurrency: 1 });

  saveConfig(config);
};
