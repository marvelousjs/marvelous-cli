import * as fs from 'fs';
import * as path from 'path';
import { homedir } from 'os';
import { IAction } from '@marvelousjs/program';

interface IProps {
  name: string;
  type: string;
}

export const StopAction: IAction<IProps> = ({ name, type }) => {
  const platformConfig = {
    apps: {
      admin: {
        host: 'bitbucket.org',
        repo: 'austincodeshop/vff-app-admin.git'
      },
      web: {
        host: 'bitbucket.org',
        repo: 'austincodeshop/vff-app-web.git'
      }
    },
    gateways: {
      admin: {
        host: 'bitbucket.org',
        repo: 'austincodeshop/vff-gateway-admin.git'
      },
      static: {
        host: 'bitbucket.org',
        repo: 'austincodeshop/vff-gateway-static.git'
      },
      web: {
        host: 'bitbucket.org',
        repo: 'austincodeshop/vff-gateway-web.git'
      }
    },
    services: {
      image: {
        host: 'bitbucket.org',
        repo: 'austincodeshop/vff-service-image.git'
      },
      message: {
        host: 'bitbucket.org',
        repo: 'austincodeshop/vff-service-message.git'
      },
      platform: {
        host: 'bitbucket.org',
        repo: 'austincodeshop/vff-service-platform.git'
      },
      recipe: {
        host: 'bitbucket.org',
        repo: 'austincodeshop/vff-service-recipe.git'
      },
      user: {
        host: 'bitbucket.org',
        repo: 'austincodeshop/vff-service-user.git'
      }
    }
  };

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
