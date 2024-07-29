import * as React from 'react';
import {
  ThirdPartyJsClientProvider,
  ThirdPartyJsViewportProvider,
} from '@alistigo/third-party-js-application-react';
import { defaultInlineViewport } from '@alistigo/third-party-js-types';

import './3rd-party-js-styles.css';

import App from './App';
import hostClient from './hostClient';

export default function Module() {
  return (
    <ThirdPartyJsClientProvider client={hostClient}>
      <ThirdPartyJsViewportProvider defaultViewport={defaultInlineViewport}>
        <App />
      </ThirdPartyJsViewportProvider>
    </ThirdPartyJsClientProvider>
  );
}
