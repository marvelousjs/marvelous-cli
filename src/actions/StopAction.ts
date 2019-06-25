import { IAction } from '@marvelousjs/program';

import { loadConfig, parseType, saveConfig } from '../functions';

interface IProps {
  platformName: string;
  name?: string;
  type: string;
}

export const StopAction: IAction<IProps> = ({ platformName, name = platformName, type }) => {
  const typeParsed = parseType(type);
  if (typeParsed.singular !== 'all') {
    return;
  }

  // load config
  const config = loadConfig();

  // load platform config
  const platformConfig = config.platforms[platformName];

  ['apps', 'gateways', 'services'].forEach((type: 'apps' | 'gateways' | 'services') => {
    if (!platformConfig[type]) {
      return;
    }

    Object.keys(platformConfig[type]).forEach((objectName) => {
      const singularType = type.substr(0, type.length - 1);
      const repoName = `${name}-${singularType}-${objectName}`;

      console.log(`Stopping ${repoName}...`);

      const currentDaemonIndex = config.daemons.findIndex(d => d.name === repoName);
      if (currentDaemonIndex !== -1) {
        try {
          process.kill(config.daemons[currentDaemonIndex].pid);
        } catch {}
        config.daemons.splice(currentDaemonIndex, 1);
      }
    });
  });

  saveConfig(config);
};
