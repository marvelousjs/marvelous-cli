import { IAction } from '@marvelousjs/program';

import { loadConfig, saveConfig } from '../functions';

interface IProps {
  name: string;
  value: string;
}

export const SetAction: IAction<IProps> = ({ name, value }) => {
  // load config
  const config = loadConfig();

  if (!config.settings) {
    config.settings = {};
  }
  (config.settings as any)[name] = value;

  // save config
  saveConfig(config);
};
