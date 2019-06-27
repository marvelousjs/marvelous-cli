import { IPlatformConfig, IArtifact } from '../interfaces';

interface IToArtifactArray {
  (config: IPlatformConfig, filter?: IFilter, opts?: IOptions): IArtifact[];
}

interface IFilter {
  name?: string;
  type?: string;
}

interface IOptions {
  reverse?: boolean;
}

export const toArtifactArray: IToArtifactArray = (config, filter = {}, { reverse = false } = {}) => {
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

  const tools = Object.entries(config.tools).map(([name, tool]) => ({
    ...tool,
    name,
    type: 'tool'
  }));

  const array = reverse
    ? tools
      .concat(services)
      .concat(gateways)
      .concat(apps)
    : apps
      .concat(gateways)
      .concat(services)
      .concat(tools);

  return array
    .filter(
      artifact =>
        (!filter.type || filter.type === 'all' || filter.type === artifact.type) &&
        (!filter.name || filter.name === '' || filter.name === artifact.name)
    ) as IArtifact[];
};
