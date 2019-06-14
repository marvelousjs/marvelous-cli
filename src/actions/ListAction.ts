import { IAction } from '@marvelousjs/program';

import { loadConfig } from '../functions';

export const ListAction: IAction = () => {
  // get config file
  const config = loadConfig();

  console.log('Platforms:');
  Object.keys(config.platforms || {}).forEach(platform => {
    console.log(`- ${platform}`);
  });
};
