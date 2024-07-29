import React, { useState, useEffect, PropsWithChildren } from 'react';
import { ThirdPartyApplicationClient } from '@alistigo/third-party-js-application-client';

export const ThirdPartyJsClientContext = React.createContext<
  ThirdPartyApplicationClient | undefined
>(undefined);

export interface ThirdPartyJsClientProviderProperties
  extends PropsWithChildren {
  client: ThirdPartyApplicationClient | undefined;
}

export function ThirdPartyJsClientProvider({
  children,
  client = undefined,
}: ThirdPartyJsClientProviderProperties) {
  const [actualClient] = useState<ThirdPartyApplicationClient | undefined>(
    client,
  );
  const [clientHostDataInitialized, setClientHostDataInitialized] =
    useState(false);

  useEffect(() => {
    const WaitForHostClientDataInitialized = async () => {
      if (!client) {
        setClientHostDataInitialized(false);
        return;
      }
      await client.waitHostData();
      setClientHostDataInitialized(true);
    };

    WaitForHostClientDataInitialized();
  }, [client]);

  return (
    <ThirdPartyJsClientContext.Provider value={actualClient}>
      {clientHostDataInitialized && children}
    </ThirdPartyJsClientContext.Provider>
  );
}
