import data from '../data';
import { ContextConfigMap } from '../types';

export default function getDefaultContexts(): ContextConfigMap<any> {
  return data.defaultContexts;
}
