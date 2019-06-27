import chalk from 'chalk';
import * as fs from 'fs';
import { homedir } from 'os';
import * as path from 'path';
import * as forEach from 'p-map';
import { IAction } from '@marvelousjs/program';

import { formatPath, loadConfig, gitLog, saveConfig, toArtifactArray, parseType } from '../functions';

interface IProps {
  cliConfig: any;
  platformName: string;
  typeFilter: string;
  nameFilter: string;
}

export const HistoryAction: IAction<IProps> = async ({
  cliConfig,
  platformName,
  typeFilter,
  nameFilter
}) => {
  // load config
  const config = loadConfig();

  const artifacts = toArtifactArray(cliConfig, { name: nameFilter, type: parseType(typeFilter).singular });

  await forEach(artifacts, async artifact => {
    const historyDir = path.join(homedir(), 'Developer', platformName, artifact.repo.name);

    console.log(chalk.bold(`History for '${formatPath(historyDir)}'...`));

    if (!fs.existsSync(historyDir)) {
      console.log(chalk.yellow(`Directory does not exist. Try '${platformName} clone ${artifact.type} ${artifact.name}'.`));
      return;
    }

    await gitLog(historyDir);
  }, { concurrency: 1 });

  saveConfig(config);
};