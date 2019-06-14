export const parseType = (type: string) => {
  if (type === 'a' || type === 'app' || type === 'apps') {
    return {
      singular: 'app',
      plural: 'apps'
    };
  }

  if (type === 'g' || type === 'gateway' || type === 'gateways') {
    return {
      singular: 'gateway',
      plural: 'gateways'
    };
  }

  if (type === 'p' || type === 'platform' || type === 'platforms') {
    return {
      singular: 'platform',
      plural: 'platforms'
    };
  }

  if (type === 's' || type === 'service' || type === 'services') {
    return {
      singular: 'service',
      plural: 'services'
    };
  }

  return {
    singular: '',
    plural: ''
  };
};
