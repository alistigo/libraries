import { HostApplicationData } from './application';
import { EventDispatcher } from './event';
import {
  CommunicationLog,
  ThirdPartyApplicationClientLogLevel,
  ThirdPartyApplicationClientLogger,
} from './log';
import { CallMessage } from './messaging';

export enum ThirdPartyApplicationClientType {
  host = 'host',
  module = 'module',
}

export interface RemoteMethod {
  call: <T>(methodName: string, ...args: unknown[]) => Promise<T>;
}

export type ThirdPartyApplicationClientApi = CommunicationLog &
  EventDispatcher &
  RemoteMethod;

export interface ThirdPartyApplicationClientOptions<P = unknown> {
  clientName?: string;
  callTimeout?: number;
  currentWindow?: Window;
  targetWindow?: Window;
  requireAcknowledge?: boolean;
  origin?: string;
  clientType?: ThirdPartyApplicationClientType;
  communicationLogLevel?: ThirdPartyApplicationClientLogLevel;
  communicationLogEnabled?: boolean;
  hostData?: HostApplicationData<P>;
  logger?: ThirdPartyApplicationClientLogger;
}

export enum ThirdPartyApplicationClientEvents {
  COMMUNICATION_DEBUG_CHANGE = 'communication_debug_change',
  COMMUNICATION_LOG_LEVEL_CHANGE = 'communication_log_level_change',
  VIEWPORT_CHANGED_BY_HOST = 'viewport_changed_by_host',
  UNMOUNT = 'unmount',
  HASH_CHANGED = 'hash_changed',
}

export enum ThirdPartyContainerEvents {
  NEW_APP = '3rd_party_new_app',
  UNMOUNT_APP = '3rd_party_unmount_app',
}

export enum ThirdPartyApplicationClientCommands {
  SET_COMMUNICATION_LOG_LEVEL = 'set_communication_log_level',
  SET_COMMUNICATION_LOG_ENABLED = 'set_communication_log_enabled',
  VIEWPORT_CHANGED_BY_HOST = 'viewport_changed_by_host',
  HASH_CHANGED = 'hash_changed',
}

export interface ThirdPartyMethodCall<T = unknown> {
  message: CallMessage;
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (error: Error) => void;
  timeoutId: number | undefined;
}
