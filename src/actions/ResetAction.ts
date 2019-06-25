import chalk from 'chalk';
import { spawn } from 'child_process';
import * as fs from 'fs';
import { homedir } from 'os';
import * as path from 'path';
import * as forEach from 'p-map';
import { IAction } from '@marvelousjs/program';

import { loadConfig, saveConfig, toArtifactArray, parseType } from '../functions';

interface IProps {
  cliConfig: any;
  platformName: string;
  typeFilter: string;
  nameFilter: string;
}

const gitReset = (cwd: string) => {
  return new Promise((resolve) => {
    // create new daemon process
    const child = spawn(
      'git',
      ['reset', '--hard'],
      {
        cwd,
        stdio: ['ignore', process.stdout, process.stdout]
      }
    );
    child.on('message', console.log);
    child.on('close', resolve);
  });
}

export const ResetAction: IAction<IProps> = async ({
  cliConfig,
  platformName,
  typeFilter,
  nameFilter
}) => {
  // load config
  const config = loadConfig();

  const artifacts = toArtifactArray(cliConfig, { name: nameFilter, type: parseType(typeFilter).singular });

  await forEach(artifacts, async artifact => {
    const resetDir = path.join(homedir(), 'Developer', platformName, artifact.repo.name);

    console.log(chalk.bold(`Pulling '${resetDir}'...`));

    if (!fs.existsSync(resetDir)) {
      throw new Error(`Directory does not exist. Try '${platformName} clone ${artifact.type} ${artifact.name}'.`);
    }

    await gitReset(resetDir);
  }, { concurrency: 1 });

  saveConfig(config);
};
