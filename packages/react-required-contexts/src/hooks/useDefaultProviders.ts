import { ProviderProps } from 'react';
import { flatten, uniq, reverse } from 'lodash';

import {
  RequiredContext,
  DefaultProviderConfig,
  ContextConfigMap,
  ContextConfig,
  ContextParametersMap,
} from '../types';
import { getDefaultContexts } from '../config';
import contextName from '../utils/contextName';

function getDefaultContextConfig(
  context: RequiredContext<any>,
  configPerContext: ContextConfigMap<any>
): [string, ContextConfig<any>] | [undefined, undefined] {
  const keys = Object.keys(configPerContext);
  // eslint-disable-next-line no-plusplus
  for (let index = 0; index < keys.length; index++) {
    const value = configPerContext[keys[index]] as ContextConfig<any>;
    if (value.context === context) {
      return [keys[index], value];
    }
  }
  return [undefined, undefined];
}

function getDefaultProviderConfig(
  name: string,
  contextConfig: ContextConfig<any>,
  parameters?: ProviderProps<any>
): DefaultProviderConfig {
  return {
    name,
    provider: contextConfig.provider,
    props: {
      ...contextConfig.props,
      ...parameters,
    },
    requiredContextsName: contextConfig.requiredContextsName,
  };
}

function extractTopContexts(
  requiredContexts: DefaultProviderConfig[],
  contexts: ContextConfigMap<any>
): DefaultProviderConfig[] {
  const contextsThatRequireAnotherContexts = requiredContexts.filter(
    (context: DefaultProviderConfig) =>
      context.requiredContextsName && context.requiredContextsName?.length > 0
  );
  const rootContextNames = contextsThatRequireAnotherContexts.map(
    (context) => context.requiredContextsName
  );
  return uniq(flatten(rootContextNames)).map((name) => {
    if (!name || !contexts[name]) {
      throw new Error(`context ${name} is not defined`);
    }
    return {
      name,
      ...contexts[name],
    };
  });
}

export default function useDefaultProviders(
  requiredContexts: RequiredContext<any>[],
  parameters?: ContextParametersMap
): DefaultProviderConfig[] {
  const configPerContext = getDefaultContexts();
  const contexts = requiredContexts.map((context) => {
    const [defaultConfigName, defaultConfig] = getDefaultContextConfig(
      context,
      configPerContext
    );
    if (!defaultConfig || !defaultConfigName) {
      throw new Error(
        `Required context ${contextName(context)} is not configured`
      );
    }
    const contextParams = parameters && parameters[defaultConfigName];
    return getDefaultProviderConfig(
      defaultConfigName,
      defaultConfig,
      contextParams
    );
  });
  // Orders providers
  const orderedContexts = reverse(
    uniq([...extractTopContexts(contexts, configPerContext), ...contexts])
  );
  return orderedContexts;
}
