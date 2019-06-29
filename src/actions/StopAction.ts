import * as forEach from 'p-map';
import { IAction } from '@marvelousjs/program';

import { killPid, loadConfig, parseType, saveConfig, toArtifactArray } from '../functions';
import chalk from 'chalk';

interface IProps {
  cliConfig: any;
  // platformName: string;
  nameFilter: string;
  typeFilter: string;
}

export const StopAction: IAction<IProps> = async ({
  cliConfig,
  // platformName,
  nameFilter,
  typeFilter
}) => {
  // load config
  const config = loadConfig();

  if (!config.daemons) {
    config.daemons = [];
  }

  const artifacts = toArtifactArray(cliConfig, {
    name: nameFilter,
    type: parseType(typeFilter).singular
  });

  await forEach(artifacts, async (artifact) => {
    const currentDaemonIndex = config.daemons.findIndex(d => d.name === artifact.repo.name);
    if (currentDaemonIndex !== -1) {
      console.log(chalk.bold(`Stopping ${artifact.name} ${artifact.type}...`));

      const pid = config.daemons[currentDaemonIndex].pid;

      await killPid(pid);

      config.daemons.splice(currentDaemonIndex, 1);

      saveConfig(config);
    }
  }, { concurrency: 1 });
};
