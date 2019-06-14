import * as fs from 'fs';
import * as path from 'path';
import { homedir } from 'os';
import { IAction } from '@marvelousjs/program';

import { loadPlatformConfig, parseType } from '../functions';

interface IProps {
  name: string;
  type: string;
}

export const StopAction: IAction<IProps> = ({ name, type }) => {
  const typeParsed = parseType(type);
  if (typeParsed.singular !== 'platform') {
    return;
  }

  // load platform config
  const platformConfig = loadPlatformConfig(name);

  ['apps', 'gateways', 'services'].forEach((type: 'apps' | 'gateways' | 'services') => {
    if (!platformConfig[type]) {
      return;
    }

    Object.keys(platformConfig[type]).forEach((objectName) => {
      const singularType = type.substr(0, type.length - 1);
      const repoName = `${name}-${singularType}-${objectName}`;

      console.log(`Stopping ${repoName}...`);

      // get files
      const pidFile = path.join(homedir(), `.mvs/daemons/${name}-${singularType}-${objectName}.pid`);
  
      // kill any existing processes
      if (fs.existsSync(pidFile)) {
        const currentPid = Number(fs.readFileSync(pidFile));
    
        try {
          process.kill(currentPid);
        } catch {}
    
        fs.unlinkSync(pidFile);
      }
    });
  });
};
