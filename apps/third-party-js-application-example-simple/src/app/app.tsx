// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';

import { ThirdPartyJsClientProvider } from '@alistigo/third-party-js-application-react';

import hostClient from './hostClient';

export function App() {
  return (
    <ThirdPartyJsClientProvider client={hostClient}>
      <h1>Example of basic application (do nothing)</h1>
    </ThirdPartyJsClientProvider>
  );
}

export default App;
