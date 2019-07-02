import * as fs from 'fs';
import * as path from 'path';
import { homedir } from 'os';

import { IConfig } from '../interfaces';

export const loadConfig = () => {
  // get config file
  const configFile = path.join(homedir(), '.mvs/config.json');

  // load config
  const config: IConfig = (() => {
    try {
      return JSON.parse(fs.readFileSync(configFile, 'utf8'));
    } catch {
      return {};
    }
  })();

  // validate config
  if (typeof config !== 'object') {
    throw new Error(`Config file is corrupt, should be object: ${configFile}`);
  }

  if (!config.daemons) {
    config.daemons = [];
  }

  return config;
};
