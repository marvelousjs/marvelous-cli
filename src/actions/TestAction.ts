import * as fs from 'fs';
import { homedir } from 'os';
import * as path from 'path';
import * as forEach from 'p-map';
import { IAction } from '@marvelousjs/program';

import { npmTest, loadConfig, saveConfig, toArtifactArray, parseType, formatPath, random } from '../functions';
import chalk from 'chalk';

interface IProps {
  cliConfig: any;
  platformName: string;
  typeFilter: string;
  nameFilter: string;
}

export const TestAction: IAction<IProps> = async ({
  cliConfig,
  platformName,
  typeFilter,
  nameFilter
}) => {
  // load config
  const config = loadConfig();

  const artifacts = toArtifactArray(cliConfig, { name: nameFilter, type: parseType(typeFilter).singular });

  await forEach(artifacts, async artifact => {
    const testDir = path.join(homedir(), 'Developer', platformName, artifact.repo.name);

    console.log(chalk.bold(`Testing '${formatPath(testDir)}'...`));

    if (!fs.existsSync(testDir)) {
      console.log(chalk.yellow(`Directory does not exist. Try '${platformName} clone ${artifact.type} ${artifact.name}'.`));
      return;
    }

    const randomPort = (() => {
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

    await npmTest(testDir, artifact.repo.name, randomPort);

  }, { concurrency: 1 });

  saveConfig(config);
};
