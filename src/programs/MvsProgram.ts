import * as fs from 'fs';
import * as path from 'path';
import { IProgram } from '@marvelousjs/program';

import {
  BuildAction,
  CheckoutAction,
  CloneAction,
  InstallAction,
  ListAction,
  LogsAction,
  PullAction,
  StartAction,
  StopAction,
  CodeAction,
  ResetAction,
  DiffAction,
  UpdateAction
} from '../actions';
import chalk from 'chalk';
import { InitAction } from '../actions/InitAction';
import { LinkAction } from '../actions/LinkAction';
import { StatusAction } from '../actions/StatusAction';
import { TestAction } from '../actions/TestAction';

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
        description: `build 'dist/' directory`,
        action: () => BuildAction({
          cliConfig,
          platformName,
          typeFilter: args[0],
          nameFilter: args[1]
        }),
        args: [
          {
            name: 'type',
            enum: ['all', 'app', 'gateway', 'service', 'tool'],
            required: true
          },
          {
            name: 'name',
            required: false
          }
        ]
      },
      checkout: {
        description: `checkout 'master' branch`,
        action: () => CheckoutAction({
          cliConfig,
          platformName,
          typeFilter: args[0],
          nameFilter: args[1]
        }),
        args: [
          {
            name: 'type',
            enum: ['all', 'app', 'gateway', 'service', 'tool'],
            required: true
          },
          {
            name: 'name',
            required: false
          }
        ]
      },
      clone: {
        description: `clone repositories`,
        action: () => CloneAction({
          cliConfig,
          platformName,
          typeFilter: args[0],
          nameFilter: args[1]
        }),
        args: [
          {
            name: 'type',
            enum: ['all', 'app', 'gateway', 'service', 'tool'],
            required: true
          },
          {
            name: 'name',
            required: false
          }
        ]
      },
      code: {
        description: `open in vscode`,
        action: () => CodeAction({
          cliConfig,
          platformName,
          typeFilter: args[0],
          nameFilter: args[1]
        }),
        args: [
          {
            name: 'type',
            enum: ['all', 'app', 'gateway', 'service', 'tool'],
            required: true
          },
          {
            name: 'name',
            required: false
          }
        ]
      },
      diff: {
        description: `git diff`,
        action: () => DiffAction({
          cliConfig,
          platformName,
          typeFilter: args[0],
          nameFilter: args[1]
        }),
        args: [
          {
            name: 'type',
            enum: ['all', 'app', 'gateway', 'service', 'tool'],
            required: true
          },
          {
            name: 'name',
            required: false
          }
        ]
      },
      init: {
        description: `clone, install and build`,
        action: () => InitAction({
          cliConfig,
          platformName,
          typeFilter: args[0],
          nameFilter: args[1]
        }),
        args: [
          {
            name: 'type',
            enum: ['all', 'app', 'gateway', 'service', 'tool'],
            required: true
          },
          {
            name: 'name',
            required: false
          }
        ]
      },
      install: {
        description: `install dependencies`,
        action: () => InstallAction({
          cliConfig,
          platformName,
          typeFilter: args[0],
          nameFilter: args[1]
        }),
        args: [
          {
            name: 'type',
            enum: ['all', 'app', 'gateway', 'service', 'tool'],
            required: true
          },
          {
            name: 'name',
            required: false
          }
        ]
      },
      link: {
        description: 'link packages',
        action: () => LinkAction({
          cliConfig,
          platformName,
          typeFilter: args[0],
          nameFilter: args[1]
        }),
        args: [
          {
            name: 'type',
            enum: ['all', 'app', 'gateway', 'service', 'tool'],
            required: true
          },
          {
            name: 'name',
            required: false
          }
        ]
      },
      list: {
        description: 'list all apps, gateways, services and tools',
        action: () => ListAction({
          cliConfig,
          platformName,
          typeFilter: args[0]
        }),
        args: [
          {
            name: 'type',
            enum: ['all', 'app', 'gateway', 'service', 'tool'],
            required: true
          }
        ]
      },
      logs: {
        description: 'watch logs',
        action: () => LogsAction({
          cliConfig,
          platformName,
          typeFilter: args[0],
          nameFilter: args[1]
        }),
        args: [
          {
            name: 'type',
            enum: ['all', 'app', 'gateway', 'service', 'tool'],
            required: true
          },
          {
            name: 'name',
            required: false
          }
        ]
      },
      pull: {
        description: `pull latest from 'master'`,
        action: () => PullAction({
          cliConfig,
          platformName,
          typeFilter: args[0],
          nameFilter: args[1]
        }),
        args: [
          {
            name: 'type',
            enum: ['all', 'app', 'gateway', 'service', 'tool'],
            required: true
          },
          {
            name: 'name',
            required: false
          }
        ]
      },
      reset: {
        description: `git reset --hard ${chalk.red('VERY DANGEROUS')}`,
        action: () => ResetAction({
          cliConfig,
          platformName,
          typeFilter: args[0],
          nameFilter: args[1]
        }),
        args: [
          {
            name: 'type',
            enum: ['all', 'app', 'gateway', 'service', 'tool'],
            required: true
          },
          {
            name: 'name',
            required: false
          }
        ]
      },
      start: {
        description: 'start packages',
        action: () => StartAction({
          cliConfig,
          platformName,
          typeFilter: args[0],
          nameFilter: args[1]
        }),
        args: [
          {
            name: 'type',
            enum: ['all', 'app', 'gateway', 'service', 'tool'],
            required: true
          },
          {
            name: 'name',
            required: false
          }
        ]
      },
      status: {
        description: 'check git status',
        action: () => StatusAction({
          cliConfig,
          platformName,
          typeFilter: args[0],
          nameFilter: args[1]
        }),
        args: [
          {
            name: 'type',
            enum: ['all', 'app', 'gateway', 'service', 'tool'],
            required: true
          },
          {
            name: 'name',
            required: false
          }
        ]
      },
      stop: {
        description: 'stop packages',
        action: () => StopAction({
          cliConfig,
          // platformName,
          typeFilter: args[0],
          nameFilter: args[1]
        }),
        args: [
          {
            name: 'type',
            enum: ['all', 'app', 'gateway', 'service', 'tool'],
            required: true
          },
          {
            name: 'name',
            required: false
          }
        ]
      },
      test: {
        description: 'test packages',
        action: () => TestAction({
          cliConfig,
          platformName,
          typeFilter: args[0],
          nameFilter: args[1]
        }),
        args: [
          {
            name: 'type',
            enum: ['all', 'app', 'gateway', 'service', 'tool'],
            required: true
          },
          {
            name: 'name',
            required: false
          }
        ]
      },
      update: {
        description: 'update dependencies',
        action: () => UpdateAction({
          cliConfig,
          platformName,
          typeFilter: args[0],
          nameFilter: args[1]
        }),
        args: [
          {
            name: 'type',
            enum: ['all', 'app', 'gateway', 'service', 'tool'],
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
