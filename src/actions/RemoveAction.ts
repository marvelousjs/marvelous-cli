import { IAction } from '@marvelousjs/program';
import { loadConfig, saveConfig } from '../functions';

interface IProps {
  platformName: string;
  name: string;
  type: string;
}

export const RemoveAction: IAction<IProps> = ({
  platformName,
  name = platformName,
  type
}) => {
  // get config file
  const config = loadConfig();

  if (!config.platforms || !config.platforms[platformName]) {
    throw new Error(`Platform does not exist: ${platformName}`);
  }

  if (type === 'platform') {
    delete config.platforms[platformName];
  }

  if (type === 'app') {
    if (!config.platforms[platformName].apps || !config.platforms[platformName].apps[name]) {
      throw new Error(`App does not exist: ${name}`);
    }
    delete config.platforms[platformName].apps[name];
  }

  if (type === 'gateway') {
    if (!config.platforms[platformName].gateways || !config.platforms[platformName].gateways[name]) {
      throw new Error(`Gateway does not exist: ${name}`);
    }
    delete config.platforms[platformName].gateways[name];
  }

  if (type === 'service') {
    if (!config.platforms[platformName].services || !config.platforms[platformName].services[name]) {
      throw new Error(`Service does not exist: ${name}`);
    }
    delete config.platforms[platformName].services[name];
  }

  saveConfig(config);
};
