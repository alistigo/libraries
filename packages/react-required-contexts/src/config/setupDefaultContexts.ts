import data from '../data';

export default function setupDefaultContexts(config: object) {
  data.defaultContexts = {
    ...config,
    ...data.defaultContexts,
  };
}
