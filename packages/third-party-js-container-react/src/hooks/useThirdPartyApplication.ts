import { ThirdPartyApplicationApi } from '@alistigo/third-party-js-types';
import { useEffect, useState } from 'react';

import useThirdPartyApplicationClient from './useThirdPartyApplicationClient';

export default function useThirdPartyApplication(
  name: string,
): ThirdPartyApplicationApi | undefined {
  const [application, setApplication] = useState<ThirdPartyApplicationApi>();
  const client = useThirdPartyApplicationClient(name);

  useEffect(() => {
    if (client && (client as unknown as ThirdPartyApplicationApi).setViewport) {
      setApplication(client as unknown as ThirdPartyApplicationApi);
    }
  }, [client]);

  return application;
}
