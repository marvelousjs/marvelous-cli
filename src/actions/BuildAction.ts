import chalk from 'chalk';
import * as fs from 'fs';
import { homedir } from 'os';
import * as path from 'path';
import * as forEach from 'p-map';
import { IAction } from '@marvelousjs/program';

import { loadConfig, npmBuild, saveConfig, toArtifactArray, parseType, formatPath } from '../functions';

interface IProps {
  cliConfig: any;
  platformName: string;
  typeFilter: string;
  nameFilter: string;
}

export const BuildAction: IAction<IProps> = async ({
  cliConfig,
  platformName,
  typeFilter,
  nameFilter
}) => {
  // load config
  const config = loadConfig();

  const artifacts = toArtifactArray(cliConfig, { name: nameFilter, type: parseType(typeFilter).singular }, { reverse: true });

  await forEach(artifacts, async artifact => {
    const buildDir = path.join(homedir(), 'Developer', platformName, artifact.repo.name);

    console.log(chalk.bold(`Building '${formatPath(buildDir)}'...`));

    if (!fs.existsSync(buildDir)) {
      console.log(chalk.yellow(`Directory does not exist. Try '${platformName} clone ${artifact.type} ${artifact.name}'.`));
      return;
    }

    await npmBuild(buildDir);
  }, { concurrency: 1 });

  saveConfig(config);
};
