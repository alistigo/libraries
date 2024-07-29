/* eslint-disable no-underscore-dangle */
import {
  CallMessage,
  MessageType,
  AcknowledgeMessage,
  ResultMessage,
} from '@alistigo/third-party-js-types';

import getWindowHost from './getWindowHost';

export const MESSAGING_PROTOCOL_VERSION = 1;

export function acknowledgeMessage(
  message: CallMessage,
  from: string
): AcknowledgeMessage {
  return {
    __from: from,
    methodName: message.methodName,
    __messageId: message.__messageId,
    __acknowledged: true,
    __type: MessageType.ACK,
    __protocolVersion: MESSAGING_PROTOCOL_VERSION,
  };
}

export function resultMessage(
  message: CallMessage,
  result: any,
  from: string
): ResultMessage {
  return {
    __from: from,
    methodName: message.methodName,
    __messageId: message.__messageId,
    __acknowledged: true,
    __type: MessageType.RESULT,
    result,
    __protocolVersion: MESSAGING_PROTOCOL_VERSION,
  };
}

export function responseMessageFromEvent(
  event: MessageEvent,
  result?: any,
  from: string = 'responseMessageFromEvent'
): void {
  if (event.data.__acknowledged) {
    return;
  }
  const call: CallMessage = event.data as CallMessage;
  const message =
    typeof result !== 'undefined'
      ? resultMessage(call, result, from)
      : acknowledgeMessage(call, from);

  const parent = getWindowHost();
  if (parent) {
    parent.postMessage(message, event.origin);
  }
}
