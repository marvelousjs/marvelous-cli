import { IAction } from '@marvelousjs/program';
import { loadPlatformConfig } from '../functions';

interface IProps {
  name: string;
  type: string;
}

export const LogsAction: IAction<IProps> = ({ name, type }) => {
  // get config file
  const platformConfig = loadPlatformConfig(name);
  console.log(platformConfig, name, type);
};
