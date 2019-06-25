// import { spawn } from 'child_process';
import * as fs from 'fs';
import { homedir } from 'os';
import * as path from 'path';
import { IAction } from '@marvelousjs/program';

import { loadConfig, parseType, saveConfig } from '../functions';
import chalk from 'chalk';

interface IProps {
  platformName: string;
  name: string;
  type: string;
}

export const InitAction: IAction<IProps> = async ({
  platformName,
  name = platformName,
  type
}) => {
  const typeParsed = parseType(type);
  if (typeParsed.singular !== 'platform') {
    return;
  }

  // load config
  const config = loadConfig();

  if (type === 'platform') {
    if (!config.platforms) {
      config.platforms = {};
    }

    if (config.platforms[name]) {
      throw new Error(`Platform already exists: ${name}`);
    }

    config.platforms[name] = {
      apps: {},
      gateways: {},
      services: {}
    };

    const binPath = path.join(homedir(), '.mvs/bin');

    if (!fs.existsSync(binPath)) {
      fs.mkdirSync(binPath, { recursive: true });
    }

    const srcPath = path.join(homedir(), '.nvm/versions/node/v10.15.3/bin/mvs');
    const targetPath = path.join(binPath, name);

    try {
      fs.symlinkSync(srcPath, targetPath);
    } catch (error) {
      if (error.code === 'EEXIST') {
        console.log(chalk.yellow(`WARNING: Symlink already exists: ${targetPath} -> ${srcPath}`));
      } else {
        throw error;
      }
    }
  }

  saveConfig(config);
};
