import React, { useEffect, ReactElement } from 'react';
import { container } from '@alistigo/third-party-js-container';

export interface ThirdPartyApplicationProps {
  name: string;
  url: string;
  data: any;
}

export default function ThirdPartyApplication({
  name,
  url,
  data,
}: ThirdPartyApplicationProps): ReactElement {
  useEffect(() => {
    container.unmount(name);
    container.require(name, url, { applicationParameters: data });
  }, [data, url, name]);

  return <></>;
}
