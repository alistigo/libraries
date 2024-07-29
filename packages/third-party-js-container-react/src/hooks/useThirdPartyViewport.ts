import {
  ThirdPartyApplicationApi,
  ThirdPartyApplicationEvents,
  Viewport,
} from '@alistigo/third-party-js-types';
import { useEffect, useState } from 'react';

import useThirdPartyApplication from './useThirdPartyApplication';

export type UseThirdPartyViewportResult = [
  Viewport | undefined,
  ThirdPartyApplicationApi | undefined
];

export default function useThirdPartyViewport(
  name: string
): UseThirdPartyViewportResult {
  const application = useThirdPartyApplication(name);
  const [viewport, setViewport] = useState<Viewport | undefined>();

  function viewportChangeHandler(e: Event) {
    setViewport((e as CustomEvent<Viewport>).detail);
  }

  useEffect(() => {
    if (application) {
      application.getViewport().then((value) => {
        setViewport(value);
      });

      application.addEventListener(
        ThirdPartyApplicationEvents.VIEWPORT_CHANGE,
        viewportChangeHandler
      );

      return () => {
        application.removeEventListener(
          ThirdPartyApplicationEvents.VIEWPORT_CHANGE,
          viewportChangeHandler
        );
      };
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }, [application]);

  return [viewport, application];
}
