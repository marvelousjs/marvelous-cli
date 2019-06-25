import { spawn } from 'child_process';
import * as path from 'path';
import * as forEach from 'p-map';
import { IAction } from '@marvelousjs/program';

import { loadConfig, saveConfig } from '../functions';

interface IProps {
  platformName: string;
  type: string;
}

const npmInstall = (cwd: string) => {
  return new Promise((resolve) => {
    // create new daemon process
    const child = spawn(
      'npm',
      ['install'],
      {
        cwd
      }
    );
    child.on('message', console.log);
    child.on('close', resolve);
  });
}

export const InstallAction: IAction<IProps> = async ({
  platformName,
  type
}) => {
  // load config
  const config = loadConfig();

  if (!config.platforms) {
    config.platforms = {};
  }

  if (!config.platforms[platformName]) {
    throw new Error(`Platform does not exist: ${platformName}`);
  }

  const platformConfig = config.platforms[platformName];

  console.log(type);

  await forEach(['services', 'gateways', 'apps'], async (type: 'apps' | 'gateways' | 'services') => {
    if (!platformConfig[type]) {
      return;
    }

    await forEach(Object.keys(platformConfig[type]), async (objectName) => {
      const artifact = platformConfig[type][objectName];

      console.log(`Install ${objectName} ${type} (${artifact.dir})...`);

      await npmInstall(path.normalize(artifact.dir));
    });
  });

  saveConfig(config);
};
