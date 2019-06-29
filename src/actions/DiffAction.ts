import chalk from 'chalk';
import * as fs from 'fs';
import { homedir } from 'os';
import * as path from 'path';
import * as forEach from 'p-map';
import { IAction } from '@marvelousjs/program';

import { gitDiff, loadConfig, saveConfig, toArtifactArray, parseType, formatPath } from '../functions';

interface IProps {
  cliConfig: any;
  platformName: string;
  typeFilter: string;
  nameFilter: string;
}

export const DiffAction: IAction<IProps> = async ({
  cliConfig,
  platformName,
  typeFilter,
  nameFilter
}) => {
  // load config
  const config = loadConfig();

  const artifacts = toArtifactArray(cliConfig, { name: nameFilter, type: parseType(typeFilter).singular });

  await forEach(artifacts, async artifact => {
    const diffDir = path.join(homedir(), 'Developer', platformName, artifact.repo.name);

    console.log(chalk.bold(`Diff for '${formatPath(diffDir)}'...`));

    if (!fs.existsSync(diffDir)) {
      console.log(chalk.yellow(`Directory does not exist. Try '${platformName} clone ${artifact.type} ${artifact.name}'.`));
      return;
    }

    await gitDiff(diffDir);
  }, { concurrency: 1 });

  saveConfig(config);
};
