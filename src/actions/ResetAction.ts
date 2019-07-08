import chalk from 'chalk';
import * as fs from 'fs';
import { homedir } from 'os';
import * as path from 'path';
import * as forEach from 'p-map';
import { IAction } from '@marvelousjs/program';

import { loadConfig, gitReset, saveConfig, toArtifactArray, parseType, formatPath } from '../functions';

interface IProps {
  cliConfig: any;
  platformName: string;
  typeFilter: string;
  nameFilter: string;
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

  console.log(chalk.yellow(`WARNING: Any changes to these repos will be lost. Press CTRL+C to cancel. Proceeding in 10 seconds...`))

  await new Promise((resolve) => {
    setTimeout(async () => {
      await forEach(artifacts, async artifact => {
        const resetDir = path.join(homedir(), 'Developer', platformName, artifact.repo.name);
    
        console.log(chalk.bold(`Resetting '${formatPath(resetDir)}'...`));
    
        if (!fs.existsSync(resetDir)) {
          console.log(chalk.yellow(`Directory does not exist. Try '${platformName} clone ${artifact.type} ${artifact.name}'.`));
          return;
        }
    
        await gitReset(resetDir);
      }, { concurrency: 1 });
      
      resolve();
    }, 10 * 1000);
  });

  saveConfig(config);
};
