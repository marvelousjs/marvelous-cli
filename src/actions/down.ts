import * as fs from 'fs';
import * as path from 'path';
import { homedir } from 'os';

export const downAction = () => {
  const platform = 'vff';

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

    Object.keys(platformConfig[type]).forEach((name) => {
      const singularType = type.substr(0, type.length - 1);

      // get files
      const pidFile = path.join(homedir(), `.mvs/daemons/${platform}-${singularType}-${name}.pid`);
  
      // kill any existing marvelous-service-daemon processes
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
