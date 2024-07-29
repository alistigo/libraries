import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { testHostAccess } from '@alistigo/third-party-js-assertion-tools';

import Module from './widget/Module';

const ROOT_ID = 'root';

document.addEventListener('DOMContentLoaded', () => {
  let rootDiv = document.getElementById(ROOT_ID);
  if (!rootDiv) {
    rootDiv = document.createElement('div');
    rootDiv.setAttribute('id', ROOT_ID);
    document.body.appendChild(rootDiv);
  }

  const root = createRoot(rootDiv);

  testHostAccess();

  root.render(<Module />);
});
