export interface IConfig {
  daemons?: IConfigDaemon[];
  platforms?: {
    [name: string]: IConfigPlatform;
  };
  settings?: IConfigSettings;
}

export interface IConfigDaemon {
  name: string;
  pid: number;
  port: number;
}

export interface IConfigPlatform {
  apps?: {
    [name: string]: IConfigPlatformEntity;
  };
  gateways?: {
    [name: string]: IConfigPlatformEntity;
  };
  services?: {
    [name: string]: IConfigPlatformEntity;
  };
  tools?: {
    [name: string]: IConfigPlatformEntity;
  };
}

export interface IConfigPlatformEntity {
  dir?: string;
}

export interface IConfigSettings {
  defaultWorkspaceDir?: string;
}
