import * as fs from 'fs';
import * as path from 'path';
import { IProgram } from '@marvelousjs/program';

import {
  AddAction,
  CloneAction,
  GetAction,
  ListAction,
  RemoveAction,
  RunAction,
  SetAction,
  StartAction,
  StopAction
} from '../actions';

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf-8'));

export const MvsProgram: IProgram = ({ args }) => {
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
          type: args[0],
          name: args[1],
          url: args[2]
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
            name: 'url',
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
      list: {
        action: ListAction
      },
      remove: {
        action: () => RemoveAction({
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
        action: () => StartAction({ type: args[0], name: args[1] }),
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
      stop: {
        action: () => StopAction({ type: args[0], name: args[1] }),
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
      }
    }
  };
};
