export interface IArtifact {
  name: string;
  repo: {
    name: string;
    host: string;
    path: string;
    type: string;
  }
  type: 'app' | 'gateway' | 'service' | 'tool';
}
