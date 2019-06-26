import * as path from 'path';
import { homedir } from 'os';

export const formatPath = (dirtyPath = '') => {
  const cleanPath = path.normalize(dirtyPath);
  const home = homedir();
  if (home === cleanPath.substr(0, home.length)) {
    return '~/' + cleanPath.substr(home.length + 1);
  }
  return cleanPath;
}