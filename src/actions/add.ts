import * as fs from 'fs';
import * as path from 'path';
import { homedir } from 'os';

export const addAction = () => {
  const type = process.argv[3];
  const name = process.argv[4];
  const url = process.argv[5];

  if (!type) {
    throw new Error('<type> is required.');
  }

  if (!name) {
    throw new Error('<name> is required.');
  }

  if (!url) {
    throw new Error('<url> is required.');
  }

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

  config.platforms = {
    [name]: {
      url
    }
  };

  fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
};
