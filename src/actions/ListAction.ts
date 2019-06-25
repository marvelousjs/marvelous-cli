import chalk from 'chalk';
import { IAction } from '@marvelousjs/program';

import { loadConfig } from '../functions';

interface IProps {
  platformName: string;
  type: string;
}

export const ListAction: IAction<IProps> = ({
  platformName,
  type
}) => {
  // get config file
  const config = loadConfig();

  if (!config.platforms || !config.platforms[platformName]) {
    throw new Error(`Platform does not exist: ${platformName}`);
  }

  if (type === 'all' || type === 'apps') {
    console.log('Apps:');
    if (!config.platforms[platformName].apps || Object.entries(config.platforms[platformName].apps).length === 0) {
      console.log(chalk.gray('(none)'));
    } else {
      Object.entries(config.platforms[platformName].apps || {}).forEach(([appName, app]) => {
        console.log(`- ${appName}: ${app.dir}`);
      });
    }
  }

  if (type === 'all' || type === 'gateways') {
    console.log('Gateways:');
    if (!config.platforms[platformName].gateways || Object.entries(config.platforms[platformName].gateways).length === 0) {
      console.log(chalk.gray('(none)'));
    } else {
      Object.entries(config.platforms[platformName].gateways || {}).forEach(([gatewayName, gateway]) => {
        console.log(`- ${gatewayName}: ${gateway.dir}`);
      });
    }
  }

  if (type === 'all' || type === 'services') {
    console.log('Services:');
    if (!config.platforms[platformName].services || Object.entries(config.platforms[platformName].services).length === 0) {
      console.log(chalk.gray('(none)'));
    } else {
      Object.entries(config.platforms[platformName].services).forEach(([serviceName, service]) => {
        console.log(`- ${serviceName}: ${service.dir}`);
      });
    }
  }

  if (type === 'platforms') {
    console.log('Platforms:');
    Object.keys(config.platforms || {}).forEach(platform => {
      console.log(`- ${platform}`);
    });
  }
};
