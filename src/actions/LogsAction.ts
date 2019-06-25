import { spawn } from 'child_process';
import * as path from 'path';
import * as forEach from 'p-map';
import { IAction } from '@marvelousjs/program';

import { loadConfig, saveConfig, parseType } from '../functions';
import { homedir } from 'os';

interface IProps {
  platformName: string;
  type: string;
  name: string;
}

const tailLogs = (cwd: string) => {
  return new Promise((resolve) => {
    // create new daemon process
    console.log(cwd);
    const child = spawn(
      'tail',
      ['-f', cwd],
      {
        stdio: ['ignore', process.stdout, process.stdout]
      }
    );
    child.on('message', (e) => {
      console.log(e);
    });
    child.on('close', resolve);
  });
}

export const LogsAction: IAction<IProps> = async ({
  platformName,
  type,
  name
}) => {
  // load config
  const config = loadConfig();

  if (!config.platforms || !config.platforms[platformName]) {
    throw new Error(`Platform does not exist: ${platformName}`);
  }

  const platformConfig = config.platforms[platformName];

  console.log(type);
  console.log(name);

  await forEach(['services', 'gateways', 'apps'], async (type: 'apps' | 'gateways' | 'services') => {
    if (!platformConfig[type]) {
      return;
    }

    await forEach(Object.keys(platformConfig[type]), async (objectName) => {
      // const artifact = platformConfig[type][objectName];
      const typeParsed = parseType(type);

      console.log(`Logs for ${objectName} ${type}...`);

      await tailLogs(path.join(homedir(), '.mvs/logs', `${platformName}-${typeParsed.singular}-${objectName}.log`));
    });
  });

  saveConfig(config);
};
