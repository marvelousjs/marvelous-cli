import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';
import * as forEach from 'p-map';
import { IAction } from '@marvelousjs/program';

import { loadConfig, saveConfig, parseType, tailLogs, toArtifactArray, formatPath } from '../functions';
import { homedir } from 'os';

interface IProps {
  cliConfig: any;
  platformName: string;
  typeFilter: string;
  nameFilter: string;
}

export const LogsAction: IAction<IProps> = async ({
  cliConfig = {},
  platformName,
  typeFilter,
  nameFilter
}) => {
  // load config
  const config = loadConfig();

  const artifacts = toArtifactArray(cliConfig, { name: nameFilter, type: parseType(typeFilter).singular });

  await forEach(artifacts, async artifact => {
    const logDir = path.join(homedir(), '.mvs/logs', platformName, `${artifact.repo.name}.log`);

    console.log(chalk.bold(`Logs for '${formatPath(logDir)}'...`));

    if (!fs.existsSync(logDir)) {
      console.log(chalk.yellow(`Logs don't exist yet for ${artifact.type} ${artifact.name}'.`));
      return;
    }

    await tailLogs(logDir);
  }, { concurrency: 1 });

  saveConfig(config);
};
