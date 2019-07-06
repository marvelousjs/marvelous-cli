import chalk from 'chalk';
import * as fs from 'fs';
import { homedir } from 'os';
import * as path from 'path';
import * as forEach from 'p-map';
import { IAction } from '@marvelousjs/program';

import { loadConfig, npmBuild, saveConfig, toArtifactArray, parseType, random, parseEnvVar, formatPath } from '../functions';

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
  const unfilteredArtifacts = toArtifactArray(cliConfig);

  const envMapping: any = {};
  const portMapping: any = {};
  unfilteredArtifacts.forEach(artifact => {
    // tools NEVER start
    if (artifact.type === 'tool') {
      return;
    }
    
    let port = 0;
    if (process.env[`${parseEnvVar(artifact.repo.name)}_URL`]) {
      port = Number(process.env[`${parseEnvVar(artifact.repo.name)}_URL`].split(':').slice(-1)[0]);
    } else {
      port = (() => {
        if (artifact.type === 'app') {
          return random(8100, 8999);
        }
        if (artifact.type === 'gateway') {
          return random(4100, 4999);
        }
        if (artifact.type === 'service') {
          return random(3100, 3999);
        }
      })();
    }

    if (process.env[`${parseEnvVar(artifact.repo.name)}_URL`]) {
      envMapping[`${parseEnvVar(artifact.repo.name)}_URL`] = process.env[`${parseEnvVar(artifact.repo.name)}_URL`];
    } else {
      envMapping[`${parseEnvVar(artifact.repo.name)}_URL`] = `http://localhost:${port}`;
    }
    portMapping[artifact.repo.name] = port;
  });

  await forEach(artifacts, async artifact => {
    const buildDir = path.join(homedir(), 'Developer', platformName, artifact.repo.name);

    console.log(chalk.bold(`Building '${formatPath(buildDir)}'...`));

    const isCloned = fs.existsSync(buildDir);
    const isInstalled = fs.existsSync(path.join(buildDir, 'node_modules'));

    if (!isCloned) {
      console.log(chalk.yellow(`Directory does not exist. Try '${platformName} clone ${artifact.type} ${artifact.name}'.`));
      return;
    } else if (!isInstalled) {
      console.log(chalk.yellow(`'node_modules/' does not exist. Try '${platformName} install ${artifact.type} ${artifact.name}'.`));
      return;
    }

    await npmBuild(buildDir, envMapping);
  }, { concurrency: 1 });

  saveConfig(config);
};
