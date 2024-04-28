import { PropsWithChildren, ReactElement, createElement } from 'react';

import { RequiredContext } from '../../types';
import useDefaultProviders from '../../hooks/useDefaultProviders';

export interface RequiredContextsWrapperProps extends PropsWithChildren {
  contexts: RequiredContext<any>[];
  parameters: any;
}

export default function RequiredContextsWrapper({
  children,
  contexts,
  parameters,
}: RequiredContextsWrapperProps): ReactElement {
  const providers = useDefaultProviders(contexts, parameters);
  const element: ReactElement = providers.reduce(
    (result, { provider, props }): ReactElement => {
      return createElement(provider, props, result);
    },
    children
  ) as ReactElement;
  return element;
}
