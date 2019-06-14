import * as fs from 'fs';
import * as path from 'path';
import { homedir } from 'os';

export const saveConfig = (config: object) => {
  // get config file
  const configFile = path.join(homedir(), '.mvs/config.json');

  fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
};
