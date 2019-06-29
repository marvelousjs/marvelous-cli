import * as fs from 'fs';
import { homedir } from 'os';
import * as path from 'path';
import * as forEach from 'p-map';
import { IAction } from '@marvelousjs/program';

import { gitClone, gitPull, loadConfig, npmBuild, npmInstall, saveConfig, toArtifactArray, parseType, formatPath, gitReset, npmLink } from '../functions';
import chalk from 'chalk';

interface IProps {
  cliConfig: any;
  platformName: string;
  typeFilter: string;
  nameFilter: string;
}

export const ReinitAction: IAction<IProps> = async ({
  cliConfig,
  platformName,
  typeFilter,
  nameFilter
}) => {
  // load config
  const config = loadConfig();

  const artifacts = toArtifactArray(cliConfig, { name: nameFilter, type: parseType(typeFilter).singular }, { reverse: true });

  console.log(chalk.yellow(`WARNING: Any changes to these repos will be lost. Press CTRL+C to cancel. Proceeding in 10 seconds...`))

  setTimeout(async () => {
    await forEach(artifacts, async artifact => {
      const from = `git@${artifact.repo.host}${artifact.repo.path.replace(/^\//, ':')}`;
      const to = path.join(homedir(), 'Developer', platformName, artifact.repo.name);
  
      console.log(chalk.bold(`Re-Initializing '${formatPath(to)}'...`));
  
      if (!fs.existsSync(to)) {
        await gitClone(to, from);
      } else {
        await gitReset(to);
        await gitPull(to);
      }
      await npmInstall(to);
      await npmBuild(to);
      await npmLink(to);
  
    }, { concurrency: 1 });
  }, 10 * 1000);

  saveConfig(config);
};
