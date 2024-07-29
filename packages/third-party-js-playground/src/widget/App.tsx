import React from 'react';
import cn from 'classnames';
import './3rd-party-js-styles.css';
import { useViewport } from '@alistigo/third-party-js-application-react';
import { ViewportPositionTypes } from '@alistigo/third-party-js-types';
import CallCounter from './CallCounter';
import ViewportTester from './ViewportTester';

export default function App() {
  const { viewport } = useViewport();
  const classNames = cn('module-container', {
    'module-container--fullscreen':
      viewport.type === ViewportPositionTypes.fullscreen,
  });

  return (
    <div className={classNames}>
      <h1>Widget - 3rd party js</h1>
      <ViewportTester />
      <CallCounter />
    </div>
  );
}
