import * as fs from 'fs';
import * as path from 'path';
import { homedir } from 'os';
import { IAction } from '@marvelousjs/program';

interface IProps {
  name: string;
  type: string;
}

export const RemoveAction: IAction<IProps> = ({ name, type }) => {
  if (!type) {
    throw new Error('<type> is required.');
  }

  if (!name) {
    throw new Error('<name> is required.');
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

  delete config.platforms[name];

  fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
};
