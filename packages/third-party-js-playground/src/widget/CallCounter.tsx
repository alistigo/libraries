import * as React from 'react';
import { useExternalMethodCall } from '@alistigo/third-party-js-application-react';

function addHandler(a: number, b: number) {
  return a + b;
}

export default function CallCounter() {
  const { received, callCount, data } = useExternalMethodCall('setup');
  useExternalMethodCall('add', addHandler);
  return received ? (
    <p>
      Call count {callCount} value: {JSON.stringify(data)}
    </p>
  ) : (
    <p>No setup call received</p>
  );
}
