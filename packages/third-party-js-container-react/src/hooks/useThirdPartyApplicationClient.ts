import {
  ThirdPartyApplicationClientApi,
  ThirdPartyContainerEvent,
  ThirdPartyContainerEvents,
} from '@alistigo/third-party-js-types';
import { useEffect, useState } from 'react';
import { container } from '@alistigo/third-party-js-container';

export default function useThirdPartyApplicationClient(
  name: string,
): ThirdPartyApplicationClientApi | undefined {
  const [client, setClient] = useState<ThirdPartyApplicationClientApi>();

  function handleNewApplication(event: Event) {
    const newAppEvent = event as CustomEvent<ThirdPartyContainerEvent>;
    if (newAppEvent.detail.name === name) {
      setClient(newAppEvent.detail.application);
    }
  }

  function handleUnmountApplication(event: Event) {
    const newAppEvent = event as CustomEvent<ThirdPartyContainerEvent>;
    if (newAppEvent.detail.name === name) {
      setClient(undefined);
    }
  }

  useEffect(() => {
    container.addEventListener(
      ThirdPartyContainerEvents.NEW_APP,
      handleNewApplication,
    );
    container.addEventListener(
      ThirdPartyContainerEvents.UNMOUNT_APP,
      handleUnmountApplication,
    );

    return () => {
      container.removeEventListener(
        ThirdPartyContainerEvents.NEW_APP,
        handleNewApplication,
      );
      container.removeEventListener(
        ThirdPartyContainerEvents.UNMOUNT_APP,
        handleUnmountApplication,
      );
    };
  }, [container]);

  useEffect(() => {
    const app = container.getApplication(name);
    if (app) {
      setClient(app);
    }
  }, [name]);

  return client;
}
