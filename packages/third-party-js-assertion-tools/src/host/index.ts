import Cookies from 'js-cookie';
import { Check } from '../types';

const DOM_READ_ELEMENT_ID = 'tester-dom-read';
const DOM_READ_DATA_VALUE = 'tester-dom-read-value';

const COOKIE_BASIC_NAME = 'test-cookie';
const COOKIE_BASIC_VALUE = 'test-cookie-value';

const COOKIE_SECURE_NAME = 'test-cookie-secure';
const COOKIE_SECURE_VALUE = 'test-cookie-secure-value';

const COOKIE_NON_SECURE_NAME = 'test-cookie-not-secure';
const COOKIE_NON_SECURE_VALUE = 'test-cookie-not-secure-value';

const LOCAL_STORAGE_BASIC_NAME = 'test-localstorage';
const LOCAL_STORAGE_BASIC_VALUE = 'test-localstorage-value';

const LOCAL_STORAGE_WIDGET_BASIC_NAME = 'test-localstorage-widget';
const LOCAL_STORAGE_WIDGET_BASIC_VALUE = 'test-localstorage-widget-value';

function getHost(): Window {
  return window.parent;
}

function cookieReadSetup(): void {
  Cookies.set(COOKIE_BASIC_NAME, COOKIE_BASIC_VALUE);
  Cookies.set(COOKIE_SECURE_NAME, COOKIE_SECURE_VALUE, { sameSite: 'Strict' });
  Cookies.set(COOKIE_NON_SECURE_NAME, COOKIE_NON_SECURE_VALUE, {
    sameSite: 'None',
  });
}

function cookieReadAccess(): boolean {
  try {
    const value1 = Cookies.get(COOKIE_BASIC_VALUE);
    const value2 = Cookies.get(COOKIE_SECURE_NAME);
    const value3 = Cookies.get(COOKIE_NON_SECURE_NAME);
    return !!(value1 || value2 || value3);
  } catch (e) {
    return false;
  }
}

function cookieWriteAccess(): boolean {
  return false;
}

function localStorageReadAccess(): boolean {
  try {
    const value = localStorage.getItem(LOCAL_STORAGE_BASIC_NAME);
    return value === LOCAL_STORAGE_BASIC_VALUE;
  } catch (e) {
    return false;
  }
}

function localStorageReadSetup(): void {
  localStorage.clear();
  localStorage.setItem(LOCAL_STORAGE_BASIC_NAME, LOCAL_STORAGE_BASIC_VALUE);
}

function localStorageWriteAccess(): boolean {
  try {
    localStorage.setItem(
      LOCAL_STORAGE_WIDGET_BASIC_NAME,
      LOCAL_STORAGE_WIDGET_BASIC_VALUE
    );
    return true;
  } catch (e) {
    return false;
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
function localStorageWriteSetup(): void {}

function domReadAccess(): boolean {
  try {
    const host = getHost();
    const element = host.document.getElementById(DOM_READ_ELEMENT_ID);
    return (
      !!element && element.getAttribute('data-value') === DOM_READ_DATA_VALUE
    );
  } catch (e) {
    return false;
  }
}

function domReadSetup(): void {
  let element = document.getElementById(DOM_READ_ELEMENT_ID);
  if (!element) {
    element = document.createElement('div');
    element.setAttribute('id', DOM_READ_ELEMENT_ID);
    element.setAttribute('data-value', DOM_READ_DATA_VALUE);
    document.body.appendChild(element);
  }
}

function domWriteAccess(): boolean {
  try {
    const host = getHost();
    const newNode = host.document.createElement('span');
    const element = host.document.appendChild(newNode);
    return !!element;
  } catch (e) {
    return false;
  }
}

const checks: Check[] = [
  {
    test: cookieReadAccess,
    setup: cookieReadSetup,
    errorMsg: '3rd party JS can read host cookies',
  },
  {
    test: cookieWriteAccess,
    errorMsg: '3rd party JS can write host cookies',
  },
  {
    test: localStorageReadAccess,
    setup: localStorageReadSetup,
    errorMsg: '3rd party JS can read host local storage',
  },
  {
    test: localStorageWriteAccess,
    setup: localStorageWriteSetup,
    errorMsg: '3rd party JS can write host local storage',
  },
  {
    test: domReadAccess,
    setup: domReadSetup,
    errorMsg: '3rd party JS can read host dom',
  },
  {
    test: domWriteAccess,
    errorMsg: '3rd party JS can write host dom',
  },
];

export default checks;
