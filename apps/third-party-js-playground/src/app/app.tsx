// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';

import { ThirdPartyApplication } from '@alistigo/third-party-js-container-react';

export function App() {
  return (
    <div>
      <h1>Third Party JS Playground</h1>

      <h2>Third Party JS Application example 1</h2>

      <ThirdPartyApplication
        url={
          process.env.NX_APPS_URI_THIRD_PARTY_JS_APPLICATION_EXAMPLE_SIMPLE ||
          ''
        }
        name="Third Party JS Application example 1"
        data={{}}
      />
    </div>
  );
}

export default App;
