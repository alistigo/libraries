import {
  ThirdPartyApplicationClientLogLevel,
  ThirdPartyApplicationClientEvents,
} from '@alistigo/third-party-js-types';
import { useEffect, useState } from 'react';

import useThirdPartyApplicationClient from './useThirdPartyApplicationClient';

export interface UseThirdPartyApplicationClientDebugResult {
  isCommunicationDebug: boolean;
  communicationLogLevel: ThirdPartyApplicationClientLogLevel;

  setCommunicationLogLevel: (
    level: ThirdPartyApplicationClientLogLevel
  ) => Promise<boolean>;
  setCommunicationLog: (enable: boolean) => Promise<boolean>;
}

export const ThirdPartyApplicationClientDebugStateKey =
  'THIRD_PARTY_APP_CLIENT_DEBUG_STATE';

export interface ThirdPartyApplicationClientDebugState {
  logLevel: ThirdPartyApplicationClientLogLevel;
  enabled: boolean;
}

export default function useThirdPartyApplicationClientDebug(
  name: string
): UseThirdPartyApplicationClientDebugResult {
  const client = useThirdPartyApplicationClient(name);
  const [isCommunicationDebug, setIsCommunicationDebug] = useState<boolean>(
    client?.isCommunicationLogEnabled() || false
  );
  const [communicationLogLevel, setCommunicationLogLevel] =
    useState<ThirdPartyApplicationClientLogLevel>(
      client?.getCommunicationLogLevel() ||
        ThirdPartyApplicationClientLogLevel.ERROR
    );

  function isCommunicationDebugChangeHandler(e: Event) {
    setIsCommunicationDebug((e as CustomEvent<boolean>).detail);
  }

  function communicationLogLevelChangeHandler(e: Event) {
    setCommunicationLogLevel(
      (e as CustomEvent<ThirdPartyApplicationClientLogLevel>).detail
    );
  }

  async function changeCommunicationLogLevel(
    level: ThirdPartyApplicationClientLogLevel
  ) {
    if (client) {
      localStorage.setItem(
        ThirdPartyApplicationClientDebugStateKey,
        JSON.stringify({ logLevel: level, enabled: isCommunicationDebug })
      );
      return client.setCommunicationLogLevel(level);
    }
    return Promise.resolve(false);
  }

  async function changeCommunicationLog(enable: boolean) {
    if (client) {
      localStorage.setItem(
        ThirdPartyApplicationClientDebugStateKey,
        JSON.stringify({ logLevel: communicationLogLevel, enabled: enable })
      );
      return client.setCommunicationLog(enable);
    }
    return Promise.resolve(false);
  }

  useEffect(() => {
    if (client) {
      const previousState = localStorage.getItem(
        ThirdPartyApplicationClientDebugStateKey
      );
      if (previousState) {
        const previousStateValue = JSON.parse(
          previousState
        ) as ThirdPartyApplicationClientDebugState;

        client.setCommunicationLogLevel(previousStateValue.logLevel);
        client.setCommunicationLog(previousStateValue.enabled);
      }

      setIsCommunicationDebug(client.isCommunicationLogEnabled());
      setCommunicationLogLevel(client.getCommunicationLogLevel());

      client.addEventListener(
        ThirdPartyApplicationClientEvents.COMMUNICATION_DEBUG_CHANGE,
        isCommunicationDebugChangeHandler
      );

      client.addEventListener(
        ThirdPartyApplicationClientEvents.COMMUNICATION_LOG_LEVEL_CHANGE,
        communicationLogLevelChangeHandler
      );

      return () => {
        client.removeEventListener(
          ThirdPartyApplicationClientEvents.COMMUNICATION_DEBUG_CHANGE,
          isCommunicationDebugChangeHandler
        );

        client.removeEventListener(
          ThirdPartyApplicationClientEvents.COMMUNICATION_LOG_LEVEL_CHANGE,
          communicationLogLevelChangeHandler
        );
      };
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }, [client]);

  return {
    isCommunicationDebug,
    communicationLogLevel,
    setCommunicationLogLevel: changeCommunicationLogLevel,
    setCommunicationLog: changeCommunicationLog,
  };
}
