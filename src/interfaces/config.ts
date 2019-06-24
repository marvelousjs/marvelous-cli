export interface IConfig {
  platforms: {
    [name: string]: IConfigPlatform;
  };
  settings: IConfigSettings;
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
}

export interface IConfigPlatformEntity {
  dir?: string;
}

export interface IConfigSettings {
  defaultWorkspaceDir?: string;
}
