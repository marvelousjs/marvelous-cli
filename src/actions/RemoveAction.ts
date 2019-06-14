import { IAction } from '@marvelousjs/program';
import { loadConfig, saveConfig } from '../functions';

interface IProps {
  name: string;
  type: string;
}

export const RemoveAction: IAction<IProps> = ({ name, type }) => {
  // get config file
  const config = loadConfig();

  if (type === 'platform') {
    if (!config.platforms || !config.platforms[name]) {
      throw new Error(`Platform does not exist: ${name}`);
    }
    delete config.platforms[name];
  }

  saveConfig(config);
};
