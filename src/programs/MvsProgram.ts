import * as fs from 'fs';
import * as path from 'path';
import { IProgram } from '@marvelousjs/program';

import {
  AddAction,
  BuildAction,
  CloneAction,
  GetAction,
  InitAction,
  InstallAction,
  ListAction,
  LogsAction,
  PullAction,
  RemoveAction,
  SetAction,
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
      add: {
        action: () => AddAction({
          platformName,
          type: args[0],
          name: args[1],
          dir: args[2]
        }),
        args: [
          {
            name: 'type',
            enum: ['app', 'gateway', 'platform', 'service'],
            required: true
          },
          {
            name: 'name',
            required: true
          },
          {
            name: 'dir',
            required: true
          }
        ]
      },
      build: {
        action: () => BuildAction({
          platformName,
          type: args[0]
        }),
        args: [
          {
            name: 'type',
            enum: ['all', 'apps', 'gateways', 'services'],
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
      get: {
        action: () => GetAction({ name: args[0] }),
        args: [
          {
            name: 'name',
            enum: ['defaultWorkspaceDir'],
            type: 'string'
          }
        ]
      },
      init: {
        action: () => InitAction({
          platformName,
          type: args[0],
          name: args[1]
        }),
        args: [
          {
            name: 'type',
            enum: ['platform'],
            required: true
          },
          {
            name: 'name',
            required: true
          }
        ]
      },
      install: {
        action: () => InstallAction({
          platformName,
          type: args[0]
        }),
        args: [
          {
            name: 'type',
            enum: ['all', 'apps', 'gateways', 'services'],
            required: true
          }
        ]
      },
      list: {
        action: () => ListAction({
          platformName,
          type: args[0]
        }),
        args: [
          {
            name: 'type',
            enum: ['all', 'apps', 'gateways', 'platforms', 'services'],
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
            enum: ['app', 'gateway', 'platform', 'service'],
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
          platformName,
          type: args[0]
        }),
        args: [
          {
            name: 'type',
            enum: ['all', 'apps', 'gateways', 'services'],
            required: true
          }
        ]
      },
      remove: {
        action: () => RemoveAction({
          platformName,
          type: args[0],
          name: args[1]
        }),
        args: [
          {
            name: 'type',
            enum: ['app', 'gateway', 'platform', 'service'],
            required: true
          },
          {
            name: 'name',
            required: true
          }
        ]
      },
      set: {
        action: () => SetAction({ name: args[0], value: args[1] }),
        args: [
          {
            name: 'name',
            enum: ['defaultWorkspaceDir'],
            required: true
          },
          {
            name: 'value',
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
            enum: ['all', 'app', 'gateway', 'platform', 'service'],
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
            enum: ['all', 'app', 'gateway', 'platform', 'service'],
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
