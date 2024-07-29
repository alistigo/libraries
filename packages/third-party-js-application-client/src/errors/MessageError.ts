import {
  BaseMessage,
  ThirdPartyApplicationClientType,
} from '@alistigo/third-party-js-types';

export default class MessageError extends Error {
  targetMessage: BaseMessage;

  clientType: ThirdPartyApplicationClientType;

  constructor(
    clientType: ThirdPartyApplicationClientType,
    message: BaseMessage,
    ...args: any[]
  ) {
    let msg = args[0] || '';
    msg = `[${clientType}] ${message} | ${JSON.stringify(message)}`;
    const newArgs = args;
    if (newArgs[0]) {
      newArgs[0] = msg;
    }
    super(...newArgs);
    this.targetMessage = message;
    this.clientType = clientType;
  }
}
