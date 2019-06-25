import { IPlatformConfig, IArtifact } from '../interfaces';

interface IToArtifactArray {
  (config: IPlatformConfig, filter?: IFilter): IArtifact[];
}

interface IFilter {
  name?: string;
  type?: string;
}

export const toArtifactArray: IToArtifactArray = (config, filter = {}) => {
  const apps = Object.entries(config.apps).map(([name, app]) => ({
    ...app,
    name,
    type: 'app'
  }));

  const gateways = Object.entries(config.gateways).map(([name, app]) => ({
    ...app,
    name,
    type: 'gateway'
  }));

  const services = Object.entries(config.services).map(([name, app]) => ({
    ...app,
    name,
    type: 'service'
  }));

  return apps
    .concat(gateways)
    .concat(services)
    .filter(
      artifact =>
        (!filter.type || filter.type === 'all' || filter.type === artifact.type) &&
        (!filter.name || filter.name === '' || filter.name === artifact.name)
    ) as IArtifact[];
};
