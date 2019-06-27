import * as fs from 'fs';
import { homedir } from 'os';
import * as path from 'path';
import * as forEach from 'p-map';
import { IAction } from '@marvelousjs/program';

import { npmUnlink, loadConfig, saveConfig, toArtifactArray, parseType, formatPath } from '../functions';
import chalk from 'chalk';

interface IProps {
  cliConfig: any;
  platformName: string;
  typeFilter: string;
  nameFilter: string;
}

export const UnlinkAction: IAction<IProps> = async ({
  cliConfig,
  platformName,
  typeFilter,
  nameFilter
}) => {
  // load config
  const config = loadConfig();

  const artifacts = toArtifactArray(cliConfig, { name: nameFilter, type: parseType(typeFilter).singular }, { reverse: true });

  await forEach(artifacts, async artifact => {
    const unlinkDir = path.join(homedir(), 'Developer', platformName, artifact.repo.name);

    console.log(chalk.bold(`Unlinking '${formatPath(unlinkDir)}'...`));

    if (!fs.existsSync(unlinkDir)) {
      console.log(chalk.yellow(`Directory does not exist. Try '${platformName} clone ${artifact.type} ${artifact.name}'.`));
      return;
    }

    await npmUnlink(unlinkDir);
  }, { concurrency: 1 });

  saveConfig(config);
};
