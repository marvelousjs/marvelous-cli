import * as path from 'path';
import { IAction } from '@marvelousjs/program';

import { loadConfig, saveConfig } from '../functions';

interface IProps {
  platformName: string;
  type: string;
  name: string;
  dir: string;
}

export const AddAction: IAction<IProps> = ({
  platformName,
  type,
  name,
  dir
}) => {
  // load config
  const config = loadConfig();

  if (!config.platforms || !config.platforms[platformName]) {
    throw new Error(`Platform does not exist: ${platformName}`);
  }

  const cleanDir = dir.substr(0, 1) === '/'
    ? path.normalize(dir)
    : path.join(process.cwd(), dir);

  if (type === 'app') {
    if (!config.platforms[platformName].apps) {
      config.platforms[platformName].apps = {};
    }

    if (config.platforms[platformName].apps[name]) {
      throw new Error(`App already exists: ${name}`);
    }

    config.platforms[platformName].apps[name] = {
      dir: cleanDir
    };
  }

  if (type === 'gateway') {
    if (!config.platforms[platformName].gateways) {
      config.platforms[platformName].gateways = {};
    }

    if (config.platforms[platformName].gateways[name]) {
      throw new Error(`Gateway already exists: ${name}`);
    }

    config.platforms[platformName].gateways[name] = {
      dir: cleanDir
    };
  }

  if (type === 'service') {
    if (!config.platforms[platformName].services) {
      config.platforms[platformName].services = {};
    }

    if (config.platforms[platformName].services[name]) {
      throw new Error(`Service already exists: ${name}`);
    }

    config.platforms[platformName].services[name] = {
      dir: cleanDir
    };
  }

  saveConfig(config);
};
