/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-globals */
import {
  ThirdPartyApplicationClientLogLevel,
  ThirdPartyApplicationClientCommands,
  CallMessage,
  MessageType,
  AcknowledgeMessage,
  BaseMessage,
  ResultMessage,
  ThirdPartyApplicationClientApi,
  ThirdPartyApplicationClientType,
  ThirdPartyMethodCall,
  ThirdPartyApplicationClientOptions,
  ThirdPartyApplicationClientEvents,
  ThirdPartyApplicationCommands,
  ThirdPartyApplicationEvents,
  HostApplicationData,
  StorageDataCollection,
  VersionedStorageDataSet,
  StorageData,
  ThirdPartyApplicationClientLogger,
} from '@alistigo/third-party-js-types';

import { UnexpectedMessageError, InvalidMessageError } from '../errors';
import {
  acknowledgeMessage,
  MESSAGING_PROTOCOL_VERSION,
  resultMessage,
} from '../utils/messaging';
import getOriginFromWindow from '../utils/getOriginFromWindow';

import pkg from '../../package.json';

export default class ThirdPartyApplicationClient<P = unknown>
  implements ThirdPartyApplicationClientApi
{
  public thirdPartyApplicationClientVersion: string = pkg.version;

  private clientName: string;

  private clientType: ThirdPartyApplicationClientType;

  currentWindow: Window;

  private targetWindow?: Window;

  private origin: string;

  private targetOrigin: string;

  private callTimeout: number;

  private requireAcknowledge: boolean;

  private queueCalls: ThirdPartyMethodCall<unknown>[] = [];

  private communicationLogEnabled: boolean;

  private communicationLogLevel: ThirdPartyApplicationClientLogLevel;

  private hostData:
    | HostApplicationData<P>
    | undefined
    | Promise<HostApplicationData<P>> = undefined;

  private eventListeners: {
    type: string;
    listener: EventListenerOrEventListenerObject;
  }[] = [];

  private logger: ThirdPartyApplicationClientLogger;

  private hash: string | undefined;

  constructor({
    callTimeout = 2000,
    currentWindow = global.window,
    targetWindow = parent,
    requireAcknowledge = true,
    origin,
    clientType = ThirdPartyApplicationClientType.module,
    communicationLogLevel = ThirdPartyApplicationClientLogLevel.ERROR,
    communicationLogEnabled = false,
    clientName,
    hostData,
    logger = console,
  }: ThirdPartyApplicationClientOptions<P> = {}) {
    if (
      clientType === ThirdPartyApplicationClientType.module &&
      targetWindow === currentWindow
    ) {
      throw new Error('Try to execute outside of an iframe environment');
    }

    this.clientName = clientName || `3rd-party-app-client-${Date.now()}`;

    this.logger = logger;
    this.communicationLogEnabled = communicationLogEnabled;
    this.communicationLogLevel = communicationLogLevel;

    this.clientType = clientType;
    this.queueCalls = [];
    this.origin = origin || getOriginFromWindow(currentWindow);
    this.callTimeout = callTimeout;
    this.requireAcknowledge = requireAcknowledge;

    this.targetWindow = targetWindow;
    this.targetOrigin = '*'; // getOriginFromWindow(this.targetWindow);
    this.currentWindow = currentWindow;

    this.currentWindow.addEventListener(
      'message',
      this.onReceiveMessageHandler.bind(this)
    );

    this.hostData = hostData;

    this.communicationLogMessage(
      ThirdPartyApplicationClientLogLevel.DEBUG,
      'ThirdPartyApplicationClient instance created'
    );

    if (clientType === ThirdPartyApplicationClientType.module) {
      this.command<boolean>(
        ThirdPartyApplicationCommands.APPLICATION_READY_TO_LISTEN
      );
    }
  }

  setTargetWindow(target: Window): void {
    this.targetWindow = target;
  }

  protected setTargetOrigin(url: string): void {
    this.targetOrigin = url;
  }

  initHostData(): Promise<HostApplicationData<P>> {
    if (this.hostData !== undefined) {
      return Promise.resolve(this.hostData);
    }

    this.hostData = this.command<HostApplicationData<P>>(
      ThirdPartyApplicationCommands.GET_HOST_DATA
    ).then((data: HostApplicationData<P>) => {
      this.communicationLogMessage(
        ThirdPartyApplicationClientLogLevel.DEBUG,
        'Host data',
        [data]
      );
      this.hostData = data;

      this.currentWindow.dispatchEvent(
        new CustomEvent(ThirdPartyApplicationEvents.GET_HOST_DATA_CHANGE, {
          detail: data,
        })
      );

      return data;
    });

    return this.hostData;
  }

  waitHostData() {
    if (this.hostData instanceof Promise) {
      return this.hostData;
    }
    if (this.hostData) {
      return Promise.resolve(this.hostData);
    }
    throw new Error(`${this.debugName()} host data was not initialized before`);
  }

  getHostData() {
    if (this.hostData === undefined) {
      throw new Error(
        `${this.debugName()} host data was not initialized before`
      );
    }

    return this.hostData;
  }

  getApplicationParameters(): P {
    const hostData = this.getHostData();

    if (hostData instanceof Promise) {
      throw new Error('Try to access host data before completely initialized');
    }

    return hostData.parameters;
  }

  getHostSessionData(): StorageDataCollection {
    const data = this.getHostData();

    if (data instanceof Promise) {
      throw new Error('Try to access host data before completely initialized');
    }

    return data.session || {};
  }

  getHostSessionDataByKey<T>(
    key: string,
    version: number,
    defaultValue?: T
  ): T | undefined {
    const data = this.getHostSessionData();

    if (
      defaultValue &&
      (!data[key] || !data[key].version || data[key].version < version)
    ) {
      this.setHostSessionDataByKey<T>(key, version, defaultValue);
      return defaultValue;
    }
    return (data[key] ? data[key].value : defaultValue) as T;
  }

  setHostSessionDataByKey<T>(key: string, version: number, value: T) {
    const data = this.getHostSessionData();
    const dataSet: VersionedStorageDataSet<T> = {
      key,
      version,
      value,
      type: 'session',
    };

    const existingData = data[key] as StorageData<T>;

    if (existingData) {
      data[key] = {
        ...existingData,
        version,
        value,
        updatedAt: new Date(),
      };
    } else {
      data[key] = {
        value,
        createdAt: new Date(),
        version,
      };
    }

    (this.hostData as HostApplicationData).session = data;

    return this.command(
      ThirdPartyApplicationCommands.SET_HOST_STORAGE_DATA,
      dataSet
    );
  }

  deleteHostSessionDataByKey<T>(key: string) {
    const data = this.getHostSessionData();

    const existingData = data[key] as StorageData<T>;
    if (existingData) {
      delete data[key];

      (this.hostData as HostApplicationData).session = data;

      return this.command(
        ThirdPartyApplicationCommands.DELETE_HOST_STORAGE_DATA,
        {
          key,
          type: 'session',
        }
      );
    }

    return Promise.resolve(true);
  }

  mergeHostSessionDataByKey<T>(key: string, version: number, valueToMerge: T) {
    const existingData = this.getHostSessionDataByKey<T>(key, version);

    if (!existingData || typeof existingData !== 'object') {
      throw new Error('cannot merge value to null or not an object');
    }

    const newValue = {
      ...existingData,
      ...valueToMerge,
    };

    return this.setHostSessionDataByKey(key, version, newValue);
  }

  setCommunicationLogLevel(
    level: ThirdPartyApplicationClientLogLevel
  ): Promise<boolean> {
    this.communicationLogLevel = level;

    this.communicationLogMessage(
      ThirdPartyApplicationClientLogLevel.DEBUG,
      `.setCommunicationLogLevel`,
      [level]
    );

    this.currentWindow.dispatchEvent(
      new CustomEvent(
        ThirdPartyApplicationClientEvents.COMMUNICATION_LOG_LEVEL_CHANGE,
        {
          detail: level,
        }
      )
    );

    return this.command(
      ThirdPartyApplicationClientCommands.SET_COMMUNICATION_LOG_LEVEL,
      level
    );
  }

  setCommunicationLog(enable: boolean): Promise<boolean> {
    this.communicationLogEnabled = enable;

    this.communicationLogMessage(
      ThirdPartyApplicationClientLogLevel.DEBUG,
      `.setCommunicationLog`,
      [enable]
    );

    this.currentWindow.dispatchEvent(
      new CustomEvent(
        ThirdPartyApplicationClientEvents.COMMUNICATION_DEBUG_CHANGE,
        {
          detail: enable,
        }
      )
    );

    return this.command(
      ThirdPartyApplicationClientCommands.SET_COMMUNICATION_LOG_ENABLED,
      enable
    );
  }

  isCommunicationLogEnabled(): boolean {
    return this.communicationLogEnabled;
  }

  getCommunicationLogLevel(): ThirdPartyApplicationClientLogLevel {
    return this.communicationLogLevel;
  }

  command<T = unknown>(commandName: string, ...args: unknown[]): Promise<T> {
    const message: CallMessage = {
      __from: this.clientName,
      methodName: commandName,
      args,
      __type: MessageType.COMMAND,
      __messageId: `ThirdPartyMethodCommandMessage-${Date.now()}-${
        Math.random() * 100
      }`,
      __requireAcknowledge: this.requireAcknowledge,
      __protocolVersion: MESSAGING_PROTOCOL_VERSION,
    };
    return this.executeCallMessage(message);
  }

  call<T = unknown>(methodName: string, ...args: unknown[]): Promise<T> {
    const message: CallMessage = {
      __from: this.clientName,
      methodName,
      args,
      __type: MessageType.CALL,
      __messageId: `ThirdPartyMethodCallMessage-${Date.now()}-${
        Math.random() * 100
      }`,
      __requireAcknowledge: this.requireAcknowledge,
      __protocolVersion: MESSAGING_PROTOCOL_VERSION,
    };
    return this.executeCallMessage(message);
  }

  private executeCallMessage<T = unknown>(message: CallMessage): Promise<T> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    let resolver = (_: T) => {};
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    let rejecter = () => {};
    const promise: Promise<T> = new Promise((resolve, reject) => {
      resolver = resolve;
      rejecter = reject;
    });
    const call: ThirdPartyMethodCall<T> = {
      message,
      promise,
      resolve: resolver,
      reject: rejecter,
      timeoutId: undefined,
    };
    this.queueCalls.push(call as ThirdPartyMethodCall<unknown>);
    this.runCallQueue();
    return promise;
  }

  private isValidOrigin(event: MessageEvent): boolean {
    if (this.clientType === ThirdPartyApplicationClientType.module) {
      // Todo check if there is a way to secure message coming from host
      return true;
    }

    if (
      this.targetOrigin === '*' ||
      this.targetOrigin === 'null' ||
      !event.origin
    ) {
      return true;
    }

    const url1 = new URL(this.targetOrigin);
    const url2 = new URL(event.origin);

    return url1.origin === url2.origin;
  }

  private onReceiveCommandMessage(command: CallMessage) {
    const result = this.onCommandReceived(command.methodName, command.args);

    if (result !== undefined) {
      const res = resultMessage(command, result, this.clientName);
      this.targetWindow?.postMessage(res, this.targetOrigin);
    } else if (command.__requireAcknowledge) {
      const ack = acknowledgeMessage(command, this.clientName);
      this.targetWindow?.postMessage(ack, this.targetOrigin);
    }
  }

  private onReceiveCallMessage(call: CallMessage) {
    this.onCallReceived(call.methodName, call.args);
    if (
      this.clientType === ThirdPartyApplicationClientType.host &&
      this.currentWindow.location.origin !== this.origin
    ) {
      throw new UnexpectedMessageError(
        this.clientType,
        call,
        'received an unexpected message of type call'
      );
    }
  }

  private onReceiveResultMessage(result: ResultMessage) {
    const call = this.getCallFromMessage(result);
    if (!call) {
      return;
    }
    this.communicationLogMessage(
      ThirdPartyApplicationClientLogLevel.DEBUG,
      `[result] received`,
      [call.message.methodName, '->', result.result]
    );
    call.resolve(result.result);
  }

  private onReceiveAcknowledgeMessage(ack: AcknowledgeMessage) {
    const call = this.getCallFromMessage(ack);
    if (!call) {
      return;
    }
    this.communicationLogMessage(
      ThirdPartyApplicationClientLogLevel.DEBUG,
      `[ack] received for`,
      [call.message.methodName]
    );
    call.resolve(true);
  }

  private getCallFromMessage(
    message: AcknowledgeMessage
  ): ThirdPartyMethodCall | undefined {
    const call = this.queueCalls.find(
      (item) => item.message.__messageId === message.__messageId
    );

    if (!call) {
      // Simply ignore
      this.communicationLogMessage(
        ThirdPartyApplicationClientLogLevel.ERROR,
        ` Response received but no associed call found`,
        [message, this]
      );

      return undefined;
    }

    this.currentWindow.clearTimeout(call.timeoutId);
    this.queueCalls = this.queueCalls.filter(
      (e) => e.message.__messageId !== call.message.__messageId
    );

    if (this.requireAcknowledge && !message.__acknowledged) {
      throw new InvalidMessageError(
        this.clientType,
        message,
        'received an invalid acknowledge message'
      );
    }

    return call;
  }

  private onReceiveMessageHandler(event: MessageEvent): void {
    if (!this.isValidOrigin(event)) {
      const source: string = event?.data?.source || '';
      const type: string = event?.data?.type || '';
      if (source.indexOf('devtools') !== -1 || type.indexOf('webpack') !== -1) {
        return;
      }
      this.communicationLogMessage(
        ThirdPartyApplicationClientLogLevel.ERROR,
        `reject message because of origin `,
        [event.origin, event.data]
      );
      return;
    }

    const message = event.data as BaseMessage;

    switch (message.__type) {
      case MessageType.RESULT: {
        this.onReceiveResultMessage(message as ResultMessage);
        break;
      }

      case MessageType.ACK: {
        this.onReceiveAcknowledgeMessage(message as AcknowledgeMessage);
        break;
      }

      case MessageType.CALL: {
        this.onReceiveCallMessage(message as CallMessage);
        break;
      }

      case MessageType.COMMAND: {
        this.onReceiveCommandMessage(message as CallMessage);
        break;
      }

      default:
        break;
    }

    this.runCallQueue();
  }

  protected runCallQueue(): void {
    if (this.queueCalls.length === 0) {
      return;
    }

    const call: ThirdPartyMethodCall = this.queueCalls[0];
    this.executeCall(call);
  }

  private executeCall(call: ThirdPartyMethodCall): void {
    if (!this.targetWindow) {
      throw new Error(`${this.debugName()} target window is not defined`);
    }

    if (call.timeoutId) {
      // ignore the call will be treated after previous is done
      return;
    }

    this.communicationLogMessage(
      ThirdPartyApplicationClientLogLevel.DEBUG,
      `[${call.message.__type}][Send] ${call.message.methodName} -> ${this.targetOrigin}`,
      [call]
    );
    if (call.message.__requireAcknowledge) {
      // eslint-disable-next-line no-param-reassign
      call.timeoutId = window.setTimeout(() => {
        call.reject(
          new Error(
            `${this.debugName()} call to ${
              call.message.methodName
            } was not acknowledged (timeout)`
          )
        );

        this.queueCalls = this.queueCalls.filter(
          (e) => e.message.__messageId !== call.message.__messageId
        );

        this.runCallQueue();
      }, this.callTimeout);
    }

    this.targetWindow.postMessage(call.message, this.targetOrigin);

    if (!call.message.__requireAcknowledge) {
      this.queueCalls = this.queueCalls.filter(
        (e) => e.message.__messageId !== call.message.__messageId
      );

      call.resolve(true);
      this.runCallQueue();
    }
  }

  protected onCommandReceived(name: string, args: unknown[]): unknown {
    this.communicationLogMessage(
      ThirdPartyApplicationClientLogLevel.DEBUG,
      '[command][Received]',
      [name, args]
    );

    switch (name) {
      case ThirdPartyApplicationClientCommands.SET_COMMUNICATION_LOG_LEVEL: {
        this.communicationLogLevel =
          args[0] as ThirdPartyApplicationClientLogLevel;
        break;
      }

      case ThirdPartyApplicationClientCommands.SET_COMMUNICATION_LOG_ENABLED: {
        this.communicationLogEnabled = args[0] as boolean;
        break;
      }

      case ThirdPartyApplicationClientCommands.VIEWPORT_CHANGED_BY_HOST: {
        this.currentWindow.dispatchEvent(
          new CustomEvent(
            ThirdPartyApplicationClientEvents.VIEWPORT_CHANGED_BY_HOST,
            {
              detail: args[0],
            }
          )
        );
        break;
      }

      case ThirdPartyApplicationClientCommands.HASH_CHANGED: {
        // eslint-disable-next-line prefer-destructuring
        this.hash = args[0] as string;
        this.currentWindow.dispatchEvent(
          new CustomEvent(ThirdPartyApplicationClientEvents.HASH_CHANGED, {
            detail: args[0],
          })
        );
        break;
      }

      default:
        break;
    }

    return undefined;
  }

  protected onCallReceived(name: string, args: unknown[]): void {
    this.communicationLogMessage(
      ThirdPartyApplicationClientLogLevel.DEBUG,
      '[call][Received]',
      [name, args]
    );
  }

  protected communicationLogMessage(
    level: ThirdPartyApplicationClientLogLevel,
    message: string,
    args: unknown[] = []
  ): void {
    if (!this.communicationLogEnabled || this.communicationLogLevel > level) {
      return;
    }

    // eslint-disable-next-line no-console
    let method = this.logger.debug;
    switch (level) {
      default:
      case ThirdPartyApplicationClientLogLevel.DEBUG: {
        break;
      }

      case ThirdPartyApplicationClientLogLevel.ERROR: {
        // eslint-disable-next-line no-console
        method = this.logger.error;
        break;
      }
      case ThirdPartyApplicationClientLogLevel.INFO: {
        // eslint-disable-next-line no-console
        method = this.logger.info;
        break;
      }
      case ThirdPartyApplicationClientLogLevel.WARNING: {
        // eslint-disable-next-line no-console
        method = this.logger.warn;
        break;
      }
    }

    method(`${this.debugName()}${message}`, ...args);
  }

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void {
    this.currentWindow.addEventListener(type, listener, options);
    this.eventListeners.push({
      type,
      listener,
    });
  }

  protected debugName() {
    return `[${this.clientType}/${this.clientName}][${this.origin}]`;
  }

  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void {
    this.currentWindow.removeEventListener(type, listener, options);
    this.eventListeners = this.eventListeners.filter(
      ({ type: typeValue, listener: listenerValue }) =>
        typeValue !== type && listenerValue !== listener
    );
  }

  removeAllEventListeners() {
    this.eventListeners.forEach(({ type, listener }) =>
      this.currentWindow.removeEventListener(type, listener)
    );
    this.eventListeners = [];
  }

  unmount(): boolean {
    this.currentWindow.dispatchEvent(
      new CustomEvent(ThirdPartyApplicationClientEvents.UNMOUNT)
    );
    this.currentWindow.removeEventListener(
      'message',
      this.onReceiveMessageHandler.bind(this)
    );
    this.removeAllEventListeners();
    return true;
  }

  markApplicationReady() {
    return this.command<boolean>(
      ThirdPartyApplicationCommands.APPLICATION_READY
    );
  }

  getHash() {
    return this.hash;
  }
}
