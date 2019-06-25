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
}

const npmBuild = (cwd: string) => {
  return new Promise((resolve) => {
    // create new daemon process
    const child = spawn(
      'npm',
      ['run', 'build:dev'],
      {
        cwd,
        stdio: ['ignore', process.stdout, process.stdout]
      }
    );
    child.on('message', console.log);
    child.on('close', resolve);
  });
}

export const BuildAction: IAction<IProps> = async ({
  cliConfig,
  platformName,
  typeFilter
}) => {
  // load config
  const config = loadConfig();

  if (!config.platforms || !config.platforms[platformName]) {
    throw new Error(`Platform does not exist: ${platformName}`);
  }

  const artifacts = toArtifactArray(cliConfig, { type: parseType(typeFilter).singular });

  await forEach(artifacts, async artifact => {
    const buildDir = path.join(homedir(), 'Developer', platformName, artifact.repo.name);

    console.log(chalk.bold(`Building ${buildDir}...`));

    if (!fs.existsSync(buildDir)) {
      throw new Error(`Directory does not exist. Try '${platformName} clone ${artifact.type} ${artifact.name}'.`);
    }

    await npmBuild(buildDir);
  }, { concurrency: 1 });

  saveConfig(config);
};
