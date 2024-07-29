/* eslint-disable no-console */
import { waitFor } from '@testing-library/react';

import {
  ThirdPartyApplicationApi,
  ThirdPartyApplicationClientLogLevel,
  ThirdPartyApplicationClientLogger,
} from '@alistigo/third-party-js-types';
import { container } from '../../third-party-js-container/src';

const TEST_APPLICATION_NAME = 'application-test';
let application: ThirdPartyApplicationApi;
let startApplicationLoad: number;

describe('Test application in a context with no latency (iframe load immediately)', () => {
  let loggerMock: ThirdPartyApplicationClientLogger;
  beforeAll(() => {
    loggerMock = {
      debug: console.debug,
      error: jest.fn(),
      info: console.info,
      warn: jest.fn(),
    };

    startApplicationLoad = Date.now();
    application = container.require<{}>(
      TEST_APPLICATION_NAME,
      'http://localhost:7545/',
      {
        logger: loggerMock,
        communicationLogEnabled: false,
        communicationLogLevel: ThirdPartyApplicationClientLogLevel.DEBUG,
      },
    );
  });

  afterAll(() => {
    container.unmount(TEST_APPLICATION_NAME);
  });

  test('application will be ready in less than 300ms', async () => {
    await waitFor(() => expect(application.isApplicationReady()).toBeTruthy(), {
      timeout: 300,
    });

    expect(Date.now() - startApplicationLoad).toBeLessThan(300);
    expect(application).not.toBeNull();
  });
});
