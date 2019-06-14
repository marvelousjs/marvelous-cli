import * as fs from 'fs';
import * as path from 'path';
import { homedir } from 'os';
import { IAction } from '@marvelousjs/program';

import { IConfig } from '../interfaces';

interface IProps {
  name: string;
}

export const GetAction: IAction<IProps> = ({
  name
}) => {
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
    return;
  }

  if (name) {
    console.log((config.settings as any)[name]);
    return;
  }

  Object.entries(config.settings || {}).forEach(
    ([key, value]) => console.log(key, value)
  );
};
