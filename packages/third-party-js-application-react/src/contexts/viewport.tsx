import React, {
  useState,
  useContext,
  useEffect,
  PropsWithChildren,
} from 'react';
import {
  Viewport,
  ThirdPartyApplicationCommands,
  defaultInlineViewport,
  ThirdPartyApplicationClientEvents,
} from '@alistigo/third-party-js-types';
import { ThirdPartyApplicationClient } from '@alistigo/third-party-js-application-client';
import { ThirdPartyJsClientContext } from './client';

export interface ThirdPartyJsViewportContextData {
  viewport: Viewport;
  setViewport: (viewport: Viewport) => void;
  updateViewport: (updatedViewport: Partial<Viewport>) => void;
  hostClient?: ThirdPartyApplicationClient;
}

const DEFAULT_VIEWPORT: Viewport = {
  ...defaultInlineViewport,
  visible: false,
};

export const ThirdPartyJsViewportContext =
  React.createContext<ThirdPartyJsViewportContextData>({
    viewport: DEFAULT_VIEWPORT,
    setViewport: () => {},
    updateViewport: () => {},
  });

export interface ThirdPartyJsViewportProviderProperties
  extends PropsWithChildren {
  defaultViewport?: Viewport;
}

export function ThirdPartyJsViewportProvider({
  children,
  defaultViewport = DEFAULT_VIEWPORT,
}: ThirdPartyJsViewportProviderProperties) {
  const hostClient = useContext(ThirdPartyJsClientContext);
  const [viewport, saveViewportValue] = useState<Viewport>(defaultViewport);

  function onViewportChangedByHost(event: CustomEvent<Viewport>) {
    const { detail: newViewportValue } = event;
    saveViewportValue(newViewportValue);
  }

  useEffect(() => {
    window.addEventListener(
      ThirdPartyApplicationClientEvents.VIEWPORT_CHANGED_BY_HOST as any,
      onViewportChangedByHost
    );

    return () => {
      window.removeEventListener(
        ThirdPartyApplicationClientEvents.VIEWPORT_CHANGED_BY_HOST as any,
        onViewportChangedByHost
      );
    };
  }, []);

  const setViewport = async (value: Viewport) => {
    if (!hostClient) {
      return;
    }

    if (
      await hostClient.command(
        ThirdPartyApplicationCommands.SET_VIEWPORT,
        value
      )
    ) {
      saveViewportValue(value);
    } else {
      throw new Error('cannot set viewport value on host');
    }
  };

  const updateViewport = async (updatedValue: Partial<Viewport>) => {
    if (!hostClient) {
      return;
    }

    if (
      await hostClient.command(
        ThirdPartyApplicationCommands.UPDATE_VIEWPORT,
        updatedValue
      )
    ) {
      saveViewportValue((currentViewport) => ({
        ...currentViewport,
        ...updatedValue,
      }));
    } else {
      throw new Error('cannot set viewport value on host');
    }
  };

  return (
    <ThirdPartyJsViewportContext.Provider
      value={{
        viewport,
        setViewport,
        updateViewport,
      }}
    >
      {children}
    </ThirdPartyJsViewportContext.Provider>
  );
}
