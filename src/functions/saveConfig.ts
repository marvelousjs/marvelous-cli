import * as fs from 'fs';
import * as path from 'path';
import { homedir } from 'os';
import { IConfig } from '../interfaces';

export const saveConfig = (config: IConfig) => {
  // get config file
  const mvsDir = path.join(homedir(), '.mvs');
  const configFile = path.join(mvsDir, 'config.json');

  if (!fs.existsSync(mvsDir)) {
    fs.mkdirSync(mvsDir, { recursive: true });
  }

  const sortedConfig: any = {};
  Object.keys(config)
    .sort((a, b) => (a < b) ? -1 : ((a > b) ? 1 : 0))
    .forEach((key: 'daemons' | 'platforms' | 'settings') => sortedConfig[key] = config[key]);

  fs.writeFileSync(configFile, JSON.stringify(sortedConfig, null, 2));
};
