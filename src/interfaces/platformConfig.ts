export interface IPlatformConfig {
  apps?: {
    [name: string]: IPlatformConfigArtifact;
  };
  gateways?: {
    [name: string]: IPlatformConfigArtifact;
  };
  services?: {
    [name: string]: IPlatformConfigArtifact;
  };
  tools?: {
    [name: string]: IPlatformConfigArtifact;
  };
}

export interface IPlatformConfigArtifact {
  name: string;
  type: string;
}