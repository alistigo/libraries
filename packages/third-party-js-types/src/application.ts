import { ThirdPartyApplicationClientApi } from './client';
import {
  ThirdPartyApplicationClientLogLevel,
  ThirdPartyApplicationClientLogger,
} from './log';
import { Viewport, ViewportPositionTypes, ViewportSize } from './viewports';

export enum ThirdPartyApplicationCommands {
  APPLICATION_READY_TO_LISTEN = 'application_ready_to_listen',
  APPLICATION_READY = 'application_ready',
  SET_VIEWPORT = 'set_viewport',
  UPDATE_VIEWPORT = 'update_viewport',
  GET_HOST_DATA = 'get_host_data',
  SET_HOST_HASH = 'set_host_hash',
  SET_HOST_STORAGE_DATA = 'set_host_storage_data',
  DELETE_HOST_STORAGE_DATA = 'delete_host_storage_data',
}

export enum ThirdPartyApplicationEvents {
  VIEWPORT_CHANGE = 'viewport_change',
  GET_HOST_DATA_CHANGE = 'get_host_data_change',
  APPLICATION_READY = 'application_ready',
}

export type ViewportChangeHandler = (viewport: Viewport) => void;

export interface ThirdPartyApplicationApi
  extends ThirdPartyApplicationClientApi {
  setViewportMode: (mode: ViewportPositionTypes) => Promise<boolean>;
  setViewportDebugMode: (enable: boolean) => Promise<boolean>;
  setViewportVisible: (visibility: boolean) => Promise<boolean>;
  setViewportSize: (size: ViewportSize) => Promise<boolean>;
  setViewport: (viewport: Viewport) => Promise<boolean>;
  getViewport: () => Promise<Viewport>;
  unmount: () => boolean;
  isApplicationReady: () => boolean;
}

export interface ThirdPartyApplicationOptions<T> {
  url?: string;
  readOnlyViewport?: boolean;
  applicationParameters?: T;
  iframe?: HTMLIFrameElement;
  viewport?: Viewport;
  targetDivNode?: HTMLDivElement;
  callTimeout?: number;
  window?: Window;
  requireAcknowledge?: boolean;
  name?: string;
  disableSandboxing?: boolean;
  communicationLogLevel?: ThirdPartyApplicationClientLogLevel;
  communicationLogEnabled?: boolean;
  logger?: ThirdPartyApplicationClientLogger;
}

export interface ThirdPartyContainerEvent {
  name: string;
  application: ThirdPartyApplicationApi;
}

export type StorageType = 'session' | 'localStorage';

export interface VersionedStorageDataSet<T = unknown> {
  key: string;
  version: number;
  value: T;
  type: StorageType;
}

export interface StorageData<T = unknown> {
  version: number;
  value: T;
  createdAt: Date;
  updatedAt?: Date;
}

export type StorageDataCollection = {
  [key: string]: StorageData;
};

export interface HostApplicationData<P = unknown> {
  parameters: P;
  session: StorageDataCollection;
  localStorage: StorageDataCollection;
}
