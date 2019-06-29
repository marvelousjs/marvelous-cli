import chalk from 'chalk';
import * as forEach from 'p-map';
import { IAction } from '@marvelousjs/program';

import { curl, loadConfig, saveConfig, toArtifactArray, parseType } from '../functions';

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

      const currentDaemon = config.daemons.find(d => d.name === artifact.repo.name);
      if (!currentDaemon) {
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

  saveConfig(config);
};
