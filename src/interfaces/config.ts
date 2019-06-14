export interface IConfig {
  platforms: {
    [name: string]: IConfigPlatform;
  }
  settings: IConfigSettings;
}

export interface IConfigPlatform {

}

export interface IConfigSettings {
  defaultWorkspaceDir?: string;
}