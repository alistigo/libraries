# Alistigo libraries

**Typescript** libraries related, builded and maintained by alistigo team.

## What is alistigo?

[Alistigo](https://www.alistigo.com) is a **universal list system**, you can use it to _add a list functionality to your service/application_ like:

- Wishlist for a e-shop
- Collaborative and comparative list to choose an accomodation on a travel site.

Alistigo is available as a _service_ or as a _docker image_.

## Open source libraries domains

### react-required-contexts libraries

A react component tree can **require multiple react context**, and its easy to be lost...

This library offers a way to define for each component (and hooks) what are their **required contexts**.

- react-required-contexts-storybook-plugin - (_Soon_) **Automatically** wrap your react components into their required contexts on **each story**.
- react-required-contexts-testing-library-plugin - (_Soon_) **Automatically** wrap your react components into their required contexts on **each test**.

### third-party-js libraries

Need to **integrate a JS app inside another application**? **Without control of the host app**, this [library](./packages/third-party-js-application-client/) is the _solution_.

Your application will be wrap in an **iframe to isolate it completely from the host application**.\
And the library offer a bunch of tools to simplify _communication_, _controls_, _api_ between the host and your application.

**react is not required to use the library** but we provide some wrappers libraries for react.

#### Usage on Host

```tsx
import { ThirdPartyApplication, useThirdPartyApplication } from '@alistigo/third-party-js-container-react';

const THIRD_PARTY_APPLICATION_NAME = 'My3rdPartyApp';

export default function App() {
  const thirdPartyApp = useThirdPartyApplication(THIRD_PARTY_APPLICATION_NAME);

  useEffect(() => {

    const communicateWith3rdPartyApp = async () => {
      // We can call a method on the 3rd party application and get a response
      const result = await thirdPartyApp.call('applicationApiMethod1', 'arg1', 33);
    }

    // You can check if the application is loaded and ready
    if (thirdPartyApp.isApplicationReady) {
      communicateWith3rdPartyApp();

      // You can also controls (with viewport plugin enabled) the aspect of the application
      thirdPartyApp.setViewportVisible();
    }

  }, [thirdPartyApp]);

  return (
    <div>
      <h1>Host</h1>

      <ThirdPartyApplication url={https://url-to-the-application-to-integrate} name={THIRD_PARTY_APPLICATION_NAME} />
    </div>
  );
}
```

#### Usage on Application

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
