/* eslint-disable no-console */
import { ThirdPartyApplicationClient } from '@alistigo/third-party-js-application-client';
import {
  Viewport,
  ThirdPartyApplicationCommands,
  ViewportPositionTypes,
  FloatingViewport,
  ThirdPartyApplicationOptions,
  ThirdPartyApplicationApi,
  ViewportSize,
  ThirdPartyApplicationClientLogLevel,
  ThirdPartyApplicationClientType,
  ThirdPartyApplicationEvents,
  defaultInlineViewport,
  ThirdPartyApplicationClientCommands,
  VersionedStorageDataSet,
  StorageType,
  HostApplicationData,
  StorageData,
} from '@alistigo/third-party-js-types';

import { buildIframe, buildTargetDivNode } from '../utils/dom';

import pkg from '../../package.json';

const defaultViewport = {
  ...defaultInlineViewport,
  visible: false,
};

export default class ThirdPartyApplication<P = unknown>
  extends ThirdPartyApplicationClient
  implements ThirdPartyApplicationApi
{
  public thirdPartyApplicationVersion: string = pkg.version;

  private name: string;

  private loaded: boolean;

  private readyToReceiveMessages = false;

  private ready = false;

  private container: HTMLDivElement;

  private viewport: Viewport;

  private iframe: HTMLIFrameElement;

  private data: HostApplicationData<P> = {
    parameters: {} as P,
    session: {},
    localStorage: {},
  };

  private readOnlyViewport: boolean;

  constructor(
    name: string,
    {
      applicationParameters = {} as P,
      targetDivNode = undefined,
      viewport = defaultViewport,
      readOnlyViewport = false,
      callTimeout = 1000,
      window = global.window,
      requireAcknowledge = true,
      disableSandboxing = false,
      communicationLogLevel = ThirdPartyApplicationClientLogLevel.ERROR,
      communicationLogEnabled = false,
      iframe,
      url,
    }: ThirdPartyApplicationOptions<P>
  ) {
    if (targetDivNode && targetDivNode.childNodes.length > 0) {
      throw new Error('given target div node is not empty');
    }
    super({
      callTimeout,
      currentWindow: window,
      requireAcknowledge,
      clientType: ThirdPartyApplicationClientType.host,
      communicationLogLevel,
      communicationLogEnabled,
      clientName: name,
    });

    this.name = name;
    this.data.parameters = applicationParameters;
    this.restoreHostApplicationData();
    this.loaded = false;
    this.container = targetDivNode || buildTargetDivNode(name);
    if (!iframe) {
      if (!url) {
        throw new Error('url options is mandatory when iframe is not provided');
      }
      this.iframe = buildIframe(name, disableSandboxing);
      this.iframe.addEventListener('load', this.onLoadHandler.bind(this));

      const urlObject = new URL(url);
      urlObject.searchParams.append(
        'rand',
        Math.round(Math.random() * 10000000).toString()
      );

      this.iframe.setAttribute('src', urlObject.href);
      this.container.appendChild(this.iframe);

      if (this.iframe.contentWindow) {
        this.setTargetWindow(this.iframe.contentWindow);
        this.setTargetOrigin(`${urlObject.protocol}//${urlObject.host}`);
      }
    } else {
      this.iframe = iframe;
      if (this.iframe.contentWindow) {
        this.setTargetWindow(this.iframe.contentWindow);
        this.setTargetOrigin(
          this.iframe.contentDocument?.location.origin || '*'
        );
      }
    }

    this.readOnlyViewport = readOnlyViewport;
    this.viewport = viewport;
    this.setViewport(viewport);

    if (iframe) {
      this.loaded = true;
    }

    window.addEventListener('hashchange', this.onWindowHashChange.bind(this));
  }

  onWindowHashChange() {
    this.applyHash();
  }

  private getHashSubStringDelimiter() {
    return `/3rdapp-${this.name}`;
  }

  private getHashParts() {
    // eslint-disable-next-line prefer-destructuring
    const sourceHash = window.location.hash;
    const delimiter = this.getHashSubStringDelimiter();
    const position = sourceHash.indexOf(delimiter);
    const posH = sourceHash.indexOf('#');

    if (position === -1) {
      return {
        baseHash: posH === -1 ? sourceHash : sourceHash.substring(posH + 1),
        hash: undefined,
      };
    }
    const hash = sourceHash.substring(position + delimiter.length);
    const baseHash = sourceHash.substring(0, position);
    return {
      baseHash: posH === -1 ? baseHash : baseHash.substring(posH + 1),
      hash,
    };
  }

  private applyHash() {
    const hashParts = this.getHashParts();
    this.command(
      ThirdPartyApplicationClientCommands.HASH_CHANGED,
      hashParts.hash
    );
  }

  setHash(pathname: string | undefined) {
    const hashParts = this.getHashParts();

    if (hashParts.hash === pathname) {
      return;
    }

    const newHash =
      !pathname || pathname === '' || pathname === '/'
        ? hashParts.baseHash
        : `${hashParts.baseHash}${this.getHashSubStringDelimiter()}${pathname}`;
    if (newHash === '/') {
      window.history.pushState(undefined, '', '');
    } else {
      window.history.pushState(undefined, '', `#${newHash}`);
    }
  }

  override unmount(): boolean {
    if (super.unmount()) {
      if (this.iframe) {
        this.iframe.removeEventListener('load', this.onLoadHandler.bind(this));
        this.iframe.remove();
      }

      this.container.remove();
      window.removeEventListener('hashchange', this.onWindowHashChange);
      return true;
    }
    return false;
  }

  private onLoadHandler() {
    this.loaded = true;
    this.runCallQueue();
  }

  protected override runCallQueue(): void {
    if (!this.loaded || !this.readyToReceiveMessages) {
      return;
    }

    super.runCallQueue();
  }

  setViewportDebugMode(enable: boolean): Promise<boolean> {
    return this.setViewport({
      ...this.viewport,
      withDebug: enable,
    });
  }

  setViewportVisible(visibility: boolean): Promise<boolean> {
    return this.setViewport({
      ...this.viewport,
      visible: visibility,
    });
  }

  setViewportSize(size: ViewportSize): Promise<boolean> {
    return this.setViewport({
      ...this.viewport,
      size,
    });
  }

  setViewportMode(mode: ViewportPositionTypes): Promise<boolean> {
    return this.setViewport({
      ...this.viewport,
      type: mode,
    });
  }

  setReadOnlyViewport(enable: boolean) {
    this.readOnlyViewport = enable;
  }

  setViewport(viewport: Viewport, fromCommand = false): Promise<boolean> {
    if (this.readOnlyViewport) {
      // Ignore all viewport changes
      return Promise.resolve<boolean>(true);
    }
    const scrollbarWidth = window.innerWidth - document.body.clientWidth || 0;
    const style: Partial<CSSStyleDeclaration> = {};
    style.overflow = 'hidden';
    style.padding = '0px';
    style.margin = '0px';
    style.transition = 'unset';
    style.zIndex = '999999';

    if (viewport.visible) {
      style.opacity = '1';
      style.visibility = 'visible';
      style.display = 'block';
    } else {
      style.opacity = '0';
      style.visibility = 'none';
      style.display = 'none';
    }

    if (viewport.withDebug) {
      style.border = '1px solid red';
      style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
    } else {
      style.border = 'unset';
      style.backgroundColor = 'unset';
    }

    switch (viewport.type) {
      case ViewportPositionTypes.floating: {
        const floatingViewport = viewport as FloatingViewport;

        style.position = 'fixed';

        style.top = floatingViewport.top
          ? (floatingViewport.top as string)
          : 'unset';
        style.bottom = floatingViewport.bottom
          ? (floatingViewport.bottom as string)
          : 'unset';
        style.left = floatingViewport.left
          ? (floatingViewport.left as string)
          : 'unset';
        style.right = floatingViewport.right
          ? (floatingViewport.right as string)
          : 'unset';
        style.width = viewport.size ? viewport.size.width : 'auto';
        style.height = viewport.size ? viewport.size.height : 'auto';
        break;
      }

      case ViewportPositionTypes.fullscreen: {
        style.width = `calc(100vw - ${scrollbarWidth}px)`;
        style.height = '100vh';
        style.position = 'fixed';
        style.bottom = 'unset';
        style.right = 'unset';
        style.top = '0px';
        style.left = '0px';
        break;
      }

      default:
      case ViewportPositionTypes.inline: {
        style.position = 'relative';
        style.width = viewport.size ? (viewport.size.width as string) : 'auto';
        style.height = viewport.size
          ? (viewport.size.height as string)
          : 'auto';
        break;
      }
    }

    Object.assign(this.iframe.style, style);

    this.viewport = viewport;

    this.currentWindow.dispatchEvent(
      new CustomEvent(ThirdPartyApplicationEvents.VIEWPORT_CHANGE, {
        detail: viewport,
      })
    );

    if (!fromCommand) {
      this.command(
        ThirdPartyApplicationClientCommands.VIEWPORT_CHANGED_BY_HOST,
        viewport
      );
    }

    return Promise.resolve<boolean>(true);
  }

  getViewport(): Promise<Viewport> {
    return Promise.resolve<Viewport>(this.viewport);
  }

  protected override onCommandReceived(name: string, args: unknown[]): unknown {
    let res = super.onCommandReceived(name, args);

    switch (name) {
      case ThirdPartyApplicationCommands.SET_VIEWPORT: {
        const viewport: Viewport = args[0] as Viewport;

        if (!viewport) {
          throw new Error('Command set viewport received invalid value');
        }

        this.setViewport(viewport, true);
        break;
      }

      case ThirdPartyApplicationCommands.UPDATE_VIEWPORT: {
        const updatedValuesViewport: Partial<Viewport> =
          args[0] as Partial<Viewport>;

        if (!updatedValuesViewport) {
          throw new Error('Command update viewport received invalid value');
        }

        this.setViewport(
          {
            ...this.viewport,
            ...updatedValuesViewport,
          },
          true
        );
        break;
      }

      case ThirdPartyApplicationCommands.GET_HOST_DATA: {
        res = this.data;
        break;
      }

      case ThirdPartyApplicationCommands.SET_HOST_STORAGE_DATA: {
        const dataSet: VersionedStorageDataSet =
          args[0] as VersionedStorageDataSet;
        this.setStorageDataByKey(
          dataSet.type,
          dataSet.key,
          dataSet.version,
          dataSet.value
        );
        break;
      }

      case ThirdPartyApplicationCommands.DELETE_HOST_STORAGE_DATA: {
        const prop = args[0] as { type: StorageType; key: string };
        this.deleteStorageDataByKey(prop.type, prop.key);
        break;
      }

      case ThirdPartyApplicationCommands.SET_HOST_HASH: {
        this.setHash(args[0] as string);

        break;
      }

      case ThirdPartyApplicationCommands.APPLICATION_READY_TO_LISTEN: {
        res = true;
        this.readyToReceiveMessages = true;
        this.applyHash();

        break;
      }

      case ThirdPartyApplicationCommands.APPLICATION_READY: {
        res = true;

        this.ready = true;
        this.applyHash();

        this.currentWindow.dispatchEvent(
          new CustomEvent(ThirdPartyApplicationEvents.APPLICATION_READY, {
            detail: {
              name: this.name,
              application: this,
            },
          })
        );

        break;
      }

      default:
        break;
    }
    return res;
  }

  protected getStorageKey(): string {
    return `3rdPartyApplication-${this.name}`;
  }

  protected restoreHostApplicationData() {
    const storageKey = this.getStorageKey();
    try {
      const serializedSessionData = sessionStorage.getItem(storageKey);

      if (serializedSessionData) {
        try {
          const sessionData = JSON.parse(serializedSessionData);
          if (sessionData) {
            this.data.session = sessionData;
          }
        } catch (e) {
          console.error('Error during session data deserialization', e);
        }
      }
    } catch (e) {
      console.warn('Cannot restore session data', e);
    }

    try {
      const serializedLocalStorageData = localStorage.getItem(storageKey);

      if (serializedLocalStorageData) {
        try {
          const localStorageData = JSON.parse(serializedLocalStorageData);
          if (localStorageData) {
            this.data.localStorage = localStorageData;
          }
        } catch (e) {
          console.error('Error during localStorage data deserialization', e);
        }
      }
    } catch (e) {
      console.warn('Cannot restore localStorage data', e);
    }
  }

  protected saveHostApplicationData() {
    try {
      const storageKey = this.getStorageKey();
      const serializedSession =
        this.data.session && Object.keys(this.data.session).length > 0
          ? JSON.stringify(this.data.session)
          : undefined;
      const serializedLocalStorage =
        this.data.localStorage && Object.keys(this.data.localStorage).length > 0
          ? JSON.stringify(this.data.localStorage)
          : undefined;

      if (serializedSession) {
        sessionStorage.setItem(storageKey, serializedSession);
      }

      if (serializedLocalStorage) {
        localStorage.setItem(storageKey, serializedLocalStorage);
      }
    } catch (e) {
      console.warn('Cannot save all host application data ', e);
    }
  }

  getStorageDataByKey<T = any>(
    type: StorageType,
    key: string,
    version: number,
    defaultValue?: T
  ): StorageData<T> | undefined {
    const existingWrapper = this.data[type][key];

    if (existingWrapper) {
      if (existingWrapper.version < version) {
        // Invalid value
        console.warn(
          `Try to read an invalid version for storage [${type}][${key}], required version is ${version}`,
          existingWrapper
        );
        delete this.data[type][key];

        this.saveHostApplicationData();
      } else {
        return existingWrapper as StorageData<T>;
      }
    }

    if (defaultValue) {
      return {
        createdAt: new Date(),
        value: defaultValue,
        version,
      };
    }

    return undefined;
  }

  setStorageDataByKey<T = any>(
    type: StorageType,
    key: string,
    version: number,
    value: T
  ) {
    const previous = this.getStorageDataByKey<T>(type, key, version);

    const newWrapper: StorageData<T> = previous
      ? {
          ...previous,
          updatedAt: new Date(),
          value,
          version,
        }
      : {
          createdAt: new Date(),
          value,
          version,
        };

    this.data[type][key] = newWrapper;
    this.saveHostApplicationData();
  }

  deleteStorageDataByKey(type: StorageType, key: string) {
    const existingWrapper = this.data[type][key];

    if (existingWrapper) {
      delete this.data[type][key];

      this.saveHostApplicationData();
    }
  }

  isApplicationReady() {
    return this.ready;
  }
}
