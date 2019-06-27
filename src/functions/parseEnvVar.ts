export const parseEnvVar = (str: string) => {
  let envVar = str.toUpperCase().replace(/-/g, '_');
  if (/^\d/.test(envVar)) {
    envVar = `_${envVar}`;
  }
  return envVar;
};
