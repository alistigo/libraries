import { Check } from './types';
import definedChecks from './host';

export function runChecks(checks: Check[]) {
  checks.forEach(({ test: testFunc, errorMsg }) => {
    if (testFunc()) {
      // eslint-disable-next-line no-console
      console.error(errorMsg);
    }
  });
}

export function setupChecks(checks: Check[]) {
  checks.forEach(({ setup }) => {
    if (setup) {
      setup();
    }
  });
}

export function setupHost() {
  document.addEventListener('DOMContentLoaded', () => {
    setupChecks(definedChecks);
  });
}

export function testHostAccess() {
  runChecks(definedChecks);
}
