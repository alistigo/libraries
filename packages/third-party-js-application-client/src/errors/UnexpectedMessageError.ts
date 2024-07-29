import {
  BaseMessage,
  ThirdPartyApplicationClientType,
} from '@alistigo/third-party-js-types';

import MessageError from './MessageError';

export default class UnexpectedMessageError extends MessageError {
  constructor(
    clientType: ThirdPartyApplicationClientType,
    message: BaseMessage,
    ...args: any[]
  ) {
    super(clientType, message, ...args);
    this.name = 'UnexpectedMessageError';
  }
}
