import chalk from 'chalk';
import * as fs from 'fs';
import { homedir } from 'os';
import * as path from 'path';
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
  // load config
  const config = loadConfig();

  if (!config.daemons) {
    config.daemons = [];
  }

  const artifacts = toArtifactArray(cliConfig, { type: parseType(typeFilter).singular });

  console.log(`    ${'NAME'.padEnd(16)} ${'TYPE'.padEnd(7)} CLONED INSTALLED BUILT URL`);
  console.log(`${'='.repeat(3)} ${'='.repeat(16)} ${'='.repeat(7)} ${'='.repeat(6)} ${'='.repeat(9)} ${'='.repeat(5)} ${'='.repeat(21)}`);

  artifacts.forEach((artifact: IArtifact) => {
    const dir = path.normalize(`${homedir()}/Developer/${platformName}/${artifact.repo.name}`);

    let status = '   ';
    let url = '';
    if (artifact.type !== 'tool') {
      const currentDaemon = config.daemons.find(d => d.name === artifact.repo.name);
      status = currentDaemon ? chalk.green('on ') : chalk.red('off');
      if (currentDaemon) {
        url = `http://localhost:${currentDaemon.port}`;
      }
    }

    const isCloned = fs.existsSync(dir) ? 'YES' : 'NO';
    const isInstalled = fs.existsSync(path.join(dir, 'node_modules')) ? 'YES' : 'NO';
    const isBuilt = fs.existsSync(path.join(dir, 'dist')) ? 'YES' : 'NO';

    console.log(`${status} ${artifact.name.padEnd(16)} ${artifact.type.padEnd(7)} ${isCloned.padEnd(6)} ${isInstalled.padEnd(9)} ${isBuilt.padEnd(5)} ${url}`);
  });
};
