import * as fs from 'fs';
import * as path from 'path';
import { homedir } from 'os';
import { IConfig } from '../interfaces';

export const saveConfig = (config: IConfig) => {
  // get config file
  const configFile = path.join(homedir(), '.mvs/config.json');

  const sortedConfig: any = {};
  Object.keys(config)
    .sort((a, b) => (a < b) ? -1 : ((a > b) ? 1 : 0))
    .forEach((key: 'daemons' | 'platforms' | 'settings') => sortedConfig[key] = config[key]);

  fs.writeFileSync(configFile, JSON.stringify(sortedConfig, null, 2));
};
