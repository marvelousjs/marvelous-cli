import * as fs from 'fs';
import * as path from 'path';
import { IProgram } from '@marvelousjs/program';

import {
  AddAction,
  CloneAction,
  GetAction,
  InitAction,
  ListAction,
  LogsAction,
  RemoveAction,
  RunAction,
  SetAction,
  StartAction,
  StopAction
} from '../actions';

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf-8'));

export const MvsProgram: IProgram = ({ args }) => {
  const platformName = process.argv[1].split('/').slice(-1)[0];

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
      clone: {
        action: CloneAction
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
            enum: ['app', 'gateway', 'platform', 'service'],
            required: true
          },
          {
            name: 'name',
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
      run: {
        action: RunAction
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
