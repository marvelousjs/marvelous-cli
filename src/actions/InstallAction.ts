import { spawn } from 'child_process';
import * as fs from 'fs';
import { homedir } from 'os';
import * as path from 'path';
import * as forEach from 'p-map';
import { IAction } from '@marvelousjs/program';

import { loadConfig, saveConfig, toArtifactArray, parseType } from '../functions';
import chalk from 'chalk';

interface IProps {
  cliConfig: any;
  platformName: string;
  typeFilter: string;
}

const npmInstall = (cwd: string) => {
  return new Promise((resolve) => {
    // create new daemon process
    const child = spawn(
      'npm',
      ['install'],
      {
        cwd,
        stdio: ['ignore', process.stdout, process.stdout]
      }
    );
    child.on('message', console.log);
    child.on('close', resolve);
  });
}

export const InstallAction: IAction<IProps> = async ({
  cliConfig,
  platformName,
  typeFilter
}) => {
  // load config
  const config = loadConfig();

  const artifacts = toArtifactArray(cliConfig, { type: parseType(typeFilter).singular });

  await forEach(artifacts, async artifact => {
    const installDir = path.join(homedir(), 'Developer', platformName, artifact.repo.name);

    console.log(chalk.bold(`Installing ${installDir}...`));

    if (!fs.existsSync(installDir)) {
      throw new Error(`Directory does not exist. Try '${platformName} clone ${artifact.type} ${artifact.name}'.`);
    }

    await npmInstall(installDir);
  }, { concurrency: 1 });

  saveConfig(config);
};
