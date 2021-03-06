import chalk from 'chalk';
import * as forEach from 'p-map';
import { IAction } from '@marvelousjs/program';

import { curl, loadConfig, toArtifactArray, parseType, isRunning } from '../functions';

interface IProps {
  cliConfig: any;
  platformName: string;
  typeFilter: string;
  nameFilter: string;
}

export const CurlAction: IAction<IProps> = async ({
  cliConfig,
  platformName,
  typeFilter,
  nameFilter
}) => {
  // load config
  const config = loadConfig();

  const artifacts = toArtifactArray(cliConfig, {
    name: nameFilter,
    type: parseType(typeFilter).singular
  });

  await forEach(
    artifacts,
    async artifact => {
      // tools NEVER start
      if (artifact.type === 'tool') {
        return;
      }

      const currentDaemonIndex = config.daemons.findIndex(d => d.name === artifact.repo.name);
      const currentDaemon = currentDaemonIndex > -1 ? config.daemons[currentDaemonIndex] : {};

      if (currentDaemonIndex === -1 || !isRunning(currentDaemon.pid)) {
        console.log(chalk.yellow(`${artifact.repo.name} is not currently running`));
        return;
      }

      const curlUrl = `http://localhost:${currentDaemon.port}${process.env.URI || ''}`;

      console.log(
        chalk.bold(
          `Curl for '${artifact.repo.name}' at ${process.env.METHOD || 'GET'} '${curlUrl}'...`
        )
      );

      await curl(curlUrl);

      // add linebreak
      console.log('');
    },
    { concurrency: 1 }
  );
};
