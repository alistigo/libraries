import { Context } from 'react';
import { ComponentWithRequiredContexts, RequiredContext } from '../types';

export default function mergeContexts(
  ...args: (ComponentWithRequiredContexts | Context<any> | any)[]
): RequiredContext<any>[] {
  const contexts = new Map<RequiredContext<any>, RequiredContext<any>>();
  args.forEach((componentOrContext) => {
    if (
      (componentOrContext as ComponentWithRequiredContexts).requiredContexts ===
      undefined
    ) {
      const context = componentOrContext as Context<any>;
      if (!contexts.has(context)) {
        contexts.set(context, context);
      } else {
        // eslint-disable-next-line no-console
        console.error('cannot find context ', context);
      }
    } else {
      const component = componentOrContext as ComponentWithRequiredContexts;
      if (
        !component.requiredContexts ||
        component.requiredContexts.length === 0
      ) {
        return;
      }

      component.requiredContexts.forEach((context) => {
        if (!contexts.has(context)) {
          contexts.set(context, context);
        }
      });
    }
  });
  return Array.from(contexts).map((value) => value[0]);
}
