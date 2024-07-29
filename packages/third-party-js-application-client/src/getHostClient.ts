import { ThirdPartyApplicationClientOptions } from '@alistigo/third-party-js-types';

import ThirdPartyApplicationClient from './classes/ThirdPartyApplicationClient';
import getWindowHost from './utils/getWindowHost';

export default function getHostClient<P>(
  options: ThirdPartyApplicationClientOptions<P> = {}
): ThirdPartyApplicationClient<P> {
  const host = getWindowHost();
  const client = new ThirdPartyApplicationClient<P>({
    targetWindow: host,
    ...options,
  });
  client.initHostData().then(() => client.markApplicationReady());

  return client;
}
