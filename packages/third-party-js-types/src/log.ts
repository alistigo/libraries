export enum ThirdPartyApplicationClientLogLevel {
  DEBUG = 0,
  INFO = 1,
  WARNING = 2,
  ERROR = 3,
}

export interface CommunicationLog {
  setCommunicationLogLevel: (
    level: ThirdPartyApplicationClientLogLevel,
  ) => Promise<boolean>;
  getCommunicationLogLevel: () => ThirdPartyApplicationClientLogLevel;

  setCommunicationLog: (enable: boolean) => Promise<boolean>;
  isCommunicationLogEnabled: () => boolean;
}

export type ThirdPartyApplicationClientLogger = Pick<
  Console,
  'warn' | 'debug' | 'error' | 'info'
>;
