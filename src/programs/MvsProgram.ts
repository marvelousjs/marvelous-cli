import * as fs from 'fs';
import * as path from 'path';
import { IProgram } from '@marvelousjs/program';

import {
  BuildAction,
  CloneAction,
  InstallAction,
  ListAction,
  LogsAction,
  PullAction,
  StartAction,
  StopAction
} from '../actions';
import chalk from 'chalk';

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf-8'));

export const MvsProgram: IProgram = ({ args }) => {
  const platformName = process.argv[1].split('/').slice(-1)[0];

  let cliConfig = {};
  Object.keys(require.cache).forEach((file) => {
    if (file.match(platformName)) {
      const dir = path.dirname(file);
      if (/\/bin$/.test(dir)) {
        const parentDir = path.dirname(dir);
        const configFile = path.join(parentDir, '.mvs.json');
        if (fs.existsSync(configFile)) {
          const configFileContents = JSON.parse(fs.readFileSync(configFile, 'utf8'));
          cliConfig = configFileContents;
        }
      }
    }
  });

  if (Object.entries(cliConfig).length === 0) {
    console.log(chalk.yellow('WARNING: CLI config is empty.'));
  }

  return {
    name: 'mvs',
    version: pkg.version,
    flags: {
      force: {
        type: 'boolean'
      }
    },
    shortFlags: {
      f: 'force'
    },
    actions: {
      build: {
        action: () => BuildAction({
          cliConfig,
          platformName,
          typeFilter: args[0]
        }),
        args: [
          {
            name: 'type',
            enum: ['all', 'app', 'gateway', 'service'],
            required: true
          }
        ]
      },
      clone: {
        action: () => CloneAction({
          cliConfig,
          platformName,
          typeFilter: args[0],
          nameFilter: args[1]
        }),
        args: [
          {
            name: 'type',
            enum: ['all', 'app', 'gateway', 'service'],
            required: true
          },
          {
            name: 'name',
            required: false
          }
        ]
      },
      install: {
        action: () => InstallAction({
          cliConfig,
          platformName,
          typeFilter: args[0]
        }),
        args: [
          {
            name: 'type',
            enum: ['all', 'app', 'gateway', 'service'],
            required: true
          }
        ]
      },
      list: {
        action: () => ListAction({
          cliConfig,
          platformName,
          typeFilter: args[0]
        }),
        args: [
          {
            name: 'type',
            enum: ['all', 'app', 'gateway', 'service'],
            required: true
          }
        ]
      },
      logs: {
        action: () => LogsAction({
          platformName,
          type: args[0],
          name: args[1]
        }),
        args: [
          {
            name: 'type',
            enum: ['all', 'app', 'gateway', 'service'],
            required: true
          },
          {
            name: 'name',
            required: true
          }
        ]
      },
      pull: {
        action: () => PullAction({
          cliConfig,
          platformName,
          typeFilter: args[0]
        }),
        args: [
          {
            name: 'type',
            enum: ['all', 'app', 'gateway', 'service'],
            required: true
          }
        ]
      },
      start: {
        action: () => StartAction({
          platformName,
          type: args[0],
          name: args[1]
        }),
        args: [
          {
            name: 'type',
            enum: ['all', 'app', 'gateway', 'service'],
            required: true
          },
          {
            name: 'name',
            required: false
          }
        ]
      },
      stop: {
        action: () => StopAction({ platformName, type: args[0], name: args[1] }),
        args: [
          {
            name: 'type',
            enum: ['all', 'app', 'gateway', 'service'],
            required: true
          },
          {
            name: 'name',
            required: false
          }
        ]
      }
    }
  };
};
