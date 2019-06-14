import { spawn } from 'child_process';
import * as forEach from 'p-map';
import * as fs from 'fs';
import * as path from 'path';
import { IAction } from '@marvelousjs/program';

import { loadConfig, loadPlatformConfig, parseType } from '../functions';

interface IProps {
  name: string;
  type: string;
}

const gitClone = (host: string, owner: string, repo: string, cwd: string) => {
  return new Promise((resolve) => {
    // create new daemon process
    const child = spawn(
      'git',
      ['clone', `https://${host}/${owner}/${repo}.git`],
      {
        cwd
      }
    );
    child.on('message', console.log);
    child.on('close', resolve);
  });
}

const npmInstall = (cwd: string) => {
  console.log(cwd);
  return new Promise((resolve) => {
    // create new daemon process
    const child = spawn(
      'npm',
      ['install'],
      {
        cwd
      }
    );
    child.on('message', console.log);
    child.on('close', resolve);
  });
}

const npmBuild = (cwd: string) => {
  console.log(cwd);
  return new Promise((resolve) => {
    // create new daemon process
    const child = spawn(
      'npm',
      ['run', 'build:dev'],
      {
        cwd
      }
    );
    child.on('message', console.log);
    child.on('close', resolve);
  });
}

export const InitAction: IAction<IProps> = async ({ name, type }) => {
  const typeParsed = parseType(type);
  if (typeParsed.singular !== 'platform') {
    return;
  }

  // load config
  const config = loadConfig();

  const platformDir = path.join(config.settings.defaultWorkspaceDir, name);

  if (fs.existsSync(platformDir)) {
    throw new Error(`Directory already exists: ${platformDir}`);
  }

  fs.mkdirSync(platformDir, { recursive: true });

  // get config file
  const platformConfig = loadPlatformConfig(name);

  await forEach(['services', 'gateways', 'apps'], async (type: 'apps' | 'gateways' | 'services') => {
    if (!platformConfig[type]) {
      return;
    }

    await forEach(Object.keys(platformConfig[type]), async (objectName) => {
      const artifact = platformConfig[type][objectName];

      const singularType = type.substr(0, type.length - 1);
      const repoName = `${name}-${singularType}-${objectName}`;

      console.log(`Cloning ${repoName}...`);

      await gitClone(artifact.host, artifact.owner, artifact.repo, path.join(config.settings.defaultWorkspaceDir, name));

      console.log(`Installing ${artifact.repo}...`);

      await npmInstall(path.join(config.settings.defaultWorkspaceDir, name, artifact.repo));

      console.log(`Building ${artifact.repo}...`);

      await npmBuild(path.join(config.settings.defaultWorkspaceDir, name, artifact.repo));
    });
  });

  console.log('Done');
};
