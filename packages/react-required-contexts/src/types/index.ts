import { Provider, ProviderProps, Context } from 'react';

export type RequiredContext<T> = Context<T>;

export interface ComponentWithRequiredContexts {
  requiredContexts?: RequiredContext<any>[];
}

export interface ContextConfig<T> {
  context: RequiredContext<T>;
  provider: Provider<T>;
  props: ProviderProps<T>;
  requiredContextsName?: string[];
}

export interface DefaultProviderConfig {
  name: string;
  provider: Provider<any>;
  props: ProviderProps<any>;
  requiredContextsName?: string[];
}

export interface ContextConfigMap<T> {
  [key: string]: ContextConfig<T>;
}

export interface ContextParametersMap {
  [key: string]: ProviderProps<any>;
}
