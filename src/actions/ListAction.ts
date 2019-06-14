import * as fs from 'fs';
import * as path from 'path';
import { homedir } from 'os';
import { IAction } from '@marvelousjs/program';

export const ListAction: IAction = () => {
  // get config file
  const configFile = path.join(homedir(), '.mvs/config.json');

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

  console.log('Platforms:');
  Object.keys(config.platforms || {}).forEach(platform => {
    console.log(`- ${platform}`);
  });
};
