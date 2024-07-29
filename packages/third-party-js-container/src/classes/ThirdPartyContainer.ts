import {
  ThirdPartyApplicationApi,
  ThirdPartyApplicationClientLogLevel,
  ThirdPartyApplicationOptions,
  ThirdPartyContainerApi,
  ThirdPartyContainerEvents,
} from '@alistigo/third-party-js-types';

import pkg from '../../package.json';
import ThirdPartyApplication from './ThirdPartyApplication';

interface ThirdPartyApplicationContainer {
  [key: string]: ThirdPartyApplicationApi;
}

export default class ThirdPartyContainer implements ThirdPartyContainerApi {
  containerVersion: string = pkg.version;

  applications: ThirdPartyApplicationContainer = {};

  private eventListeners: {
    type: string;
    listener: EventListenerOrEventListenerObject;
  }[] = [];

  // eslint-disable-next-line class-methods-use-this
  require<T>(
    name: string,
    url: string,
    options: ThirdPartyApplicationOptions<T> = {},
  ): ThirdPartyApplicationApi {
    if (this.applications[name]) {
      return this.applications[name];
    }

    const application = new ThirdPartyApplication(name, { ...options, url });
    this.applications[name] = application;
    window.dispatchEvent(
      new CustomEvent(ThirdPartyContainerEvents.NEW_APP, {
        detail: {
          name,
          application,
        },
      }),
    );

    if (
      options?.communicationLogEnabled &&
      options.communicationLogLevel &&
      options.communicationLogLevel >= ThirdPartyApplicationClientLogLevel.INFO
    ) {
      // eslint-disable-next-line no-console
      console.log(
        `Third party application ${name} (${url}) required with options`,
        options,
      );
    }

    return application;
  }

  unmount(name: string) {
    if (this.applications[name]) {
      window.dispatchEvent(
        new CustomEvent(ThirdPartyContainerEvents.UNMOUNT_APP, {
          detail: {
            name,
            application: this.applications[name],
          },
        }),
      );
      this.applications[name].unmount();

      delete this.applications[name];
      return true;
    }
    return false;
  }

  getApplication(name: string): ThirdPartyApplicationApi | undefined {
    return this.applications[name];
  }

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void {
    window.addEventListener(type, listener, options);
    this.eventListeners.push({
      type,
      listener,
    });
  }

  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void {
    window.removeEventListener(type, listener, options);
    this.eventListeners = this.eventListeners.filter(
      ({ type: typeValue, listener: listenerValue }) =>
        typeValue !== type && listenerValue !== listener,
    );
  }

  removeAllEventListeners() {
    this.eventListeners.forEach(({ type, listener }) =>
      window.removeEventListener(type, listener),
    );
    this.eventListeners = [];
  }
}
