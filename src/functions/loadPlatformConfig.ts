import * as fs from 'fs';
import * as path from 'path';
import { homedir } from 'os';

export const loadPlatformConfig = (name = '') => {
  // get config file
  const configFile = path.join(homedir(), `.mvs/platforms/${name}.json`);

  // load config
  const config = (() => {
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

  return config;
};
