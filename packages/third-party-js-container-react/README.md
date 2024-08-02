# @alistigo/third-party-js-container-react

**react** wrapper around [third-party-js-container](https://github.com/alistigo/libraries/tree/main/packages/third-party-js-container/README.md)

This library should be used on the **host** application.

## How to use

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
