# @alistigo/third-party-js-application-react

**react** wrapper around [third-party-js-application-client](https://github.com/alistigo/libraries/tree/main/packages/third-party-js-application-client/README.md)

This library should be used on the **guest** application.

## How to use

```tsx
import { ThirdPartyJsClientProvider } from '@alistigo/third-party-js-application-react';

import hostClient from './hostClient';

function ApplicationApiDefinition() {
  useExternalMethodCall<{ result1: string; result2: number }>(
    'applicationApiMethod1',
    (arg1: string, arg2: number) => ({
      result1: `${arg1}-result1`,
      result2: arg2 + 10,
    })
  );
}

export default function App() {
  return (
    <ThirdPartyJsClientProvider client={hostClient}>
      <h1>Example of application</h1>
      <ApplicationApiDefinition />
    </ThirdPartyJsClientProvider>
  );
}
```
