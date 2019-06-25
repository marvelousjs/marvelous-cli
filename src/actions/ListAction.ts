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

  console.log(`STATUS ${'NAME'.padEnd(16)} ${'TYPE'.padEnd(8)} DIRECTORY`);
  console.log(`${'='.repeat(6)} ${'='.repeat(16)} ${'='.repeat(8)} ${'='.repeat(48)}`);

  artifacts.forEach((artifact: IArtifact) => {
    console.log(`${'on'.padEnd(6)} ${artifact.name.padEnd(16)} ${artifact.type.padEnd(8)} ~/Developer/${platformName}/${artifact.repo.name}`);
  });
};
