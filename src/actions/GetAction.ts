import { IAction } from '@marvelousjs/program';

import { loadConfig } from '../functions';

interface IProps {
  name: string;
}

export const GetAction: IAction<IProps> = ({
  name
}) => {
  // load config
  const config = loadConfig();

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
