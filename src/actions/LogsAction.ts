import chalk from 'chalk';
import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as forEach from 'p-map';
import { IAction } from '@marvelousjs/program';

import { loadConfig, saveConfig, parseType, toArtifactArray } from '../functions';
import { homedir } from 'os';

interface IProps {
  cliConfig: any;
  platformName: string;
  typeFilter: string;
  nameFilter: string;
}

const tailLogs = (cwd: string) => {
  return new Promise((resolve) => {
    // create new daemon process
    const child = spawn(
      'tail',
      ['-f', cwd],
      {
        stdio: ['ignore', process.stdout, process.stdout]
      }
    );
    child.on('message', console.log);
    child.on('close', resolve);
  });
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

    console.log(chalk.bold(`Logs for '${logDir}'...`));

    if (!fs.existsSync(logDir)) {
      throw new Error(`Logs do not exist for ${artifact.repo.name}.`);
    }

    await tailLogs(logDir);
  }, { concurrency: 1 });

  saveConfig(config);
};
