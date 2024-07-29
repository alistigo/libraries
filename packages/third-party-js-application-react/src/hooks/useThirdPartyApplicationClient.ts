import { ThirdPartyApplicationClient } from '@alistigo/third-party-js-application-client';
import { useContext } from 'react';
import { ThirdPartyJsClientContext } from '../contexts/client';

export default function useThirdPartyApplicationClient(): ThirdPartyApplicationClient {
  const client = useContext<ThirdPartyApplicationClient | undefined>(
    ThirdPartyJsClientContext,
  );

  if (!client) {
    throw new Error(
      'no ThirdPartyApplicationClient in the actual context is defined or the hook is not use as children of the provider ThirdPartyJsClientProvider',
    );
  }

  return client;
}
