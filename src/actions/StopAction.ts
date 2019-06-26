import { IAction } from '@marvelousjs/program';

import { loadConfig, parseType, saveConfig, toArtifactArray } from '../functions';
import chalk from 'chalk';

interface IProps {
  cliConfig: any;
  // platformName: string;
  nameFilter: string;
  typeFilter: string;
}

export const StopAction: IAction<IProps> = ({
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

  artifacts.forEach(artifact => {
    const currentDaemonIndex = config.daemons.findIndex(d => d.name === artifact.repo.name);
    if (currentDaemonIndex !== -1) {
      console.log(chalk.bold(`Stopping ${artifact.name} ${artifact.type}...`));

      try {
        process.kill(config.daemons[currentDaemonIndex].pid);
      } catch {}
      config.daemons.splice(currentDaemonIndex, 1);
    }
  });

  saveConfig(config);
};
