import { IAction } from '@marvelousjs/program';

import { loadConfig, saveConfig } from '../functions';

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
  // load config
  const config = loadConfig();

  if (type === 'platform') {
    if (!config.platforms) {
      config.platforms = {};
    }

    if (config.platforms[name]) {
      throw new Error(`Platform already exists: ${name}`);
    }

    config.platforms = {
      [name]: {
        url
      }
    };
  }

  saveConfig(config);
};
