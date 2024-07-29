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

describe('Test application with latency (iframe load after 3s of latency)', () => {
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
      'http://localhost:7545/?loadTime=3000',
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

  test('application will be ready in less than 3s + 300ms', async () => {
    await waitFor(() => expect(application.isApplicationReady()).toBeTruthy(), {
      timeout: 3300,
    });

    expect(Date.now() - startApplicationLoad).toBeLessThan(3300);
    expect(application).not.toBeNull();
  });
});
