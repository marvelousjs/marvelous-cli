import chalk from 'chalk';
import * as fs from 'fs';
import { homedir } from 'os';
import { IAction } from '@marvelousjs/program';

import { loadConfig, toArtifactArray, parseType } from '../functions';
import { IArtifact } from '../interfaces';

interface IProps {
  cliConfig: any;
  platformName: string;
  typeFilter: string;
}

export const ListAction: IAction<IProps> = ({
  cliConfig = {},
  platformName,
  typeFilter
}) => {
  // get config file
  const config = loadConfig();

  if (!config.platforms || !config.platforms[platformName]) {
    throw new Error(`Platform does not exist: ${platformName}`);
  }

  const artifacts = toArtifactArray(cliConfig, { type: parseType(typeFilter).singular });

  console.log(`    ${'NAME'.padEnd(16)} ${'TYPE'.padEnd(8)} DIRECTORY`);
  console.log(`${'='.repeat(3)} ${'='.repeat(16)} ${'='.repeat(8)} ${'='.repeat(64)}`);

  artifacts.forEach((artifact: IArtifact) => {
    const dir = `${homedir()}/Developer/${platformName}/${artifact.repo.name}`;
    let dirOutput = chalk.gray('(none)');
    if (fs.existsSync(dir)) {
      dirOutput = dir;
    }
    console.log(`${chalk.green('on'.padEnd(3))} ${artifact.name.padEnd(16)} ${artifact.type.padEnd(8)} ${dirOutput}`);
  });
};
