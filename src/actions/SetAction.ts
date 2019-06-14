import * as fs from 'fs';
import * as path from 'path';
import { homedir } from 'os';
import { IAction } from '@marvelousjs/program';

import { IConfig } from '../interfaces';

interface IProps {
  name: string;
  value: string;
}

export const SetAction: IAction<IProps> = ({ name, value }) => {
  if (!value) {
    throw new Error('<value> is required.');
  }

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

  if (!config.settings) {
    config.settings = {};
  }
  (config.settings as any)[name] = value;

  fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
};
