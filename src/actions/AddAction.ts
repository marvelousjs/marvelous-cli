import * as fs from 'fs';
import * as path from 'path';
import { homedir } from 'os';
import { IAction } from '@marvelousjs/program';

interface IProps {
  name: string;
  type: string;
  url: string;
}

export const AddAction: IAction<IProps> = ({
  name,
  type,
  url
}) => {
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

  if (type === 'platforms') {
    config.platforms = {
      [name]: {
        url
      }
    };
  }

  fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
};
