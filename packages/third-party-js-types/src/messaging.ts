export enum MessageType {
  CALL = 'call',
  RESULT = 'result',
  ACK = 'ack',
  COMMAND = 'command',
}

export interface BaseMessage {
  methodName: string;
  __messageId: string;
  __type: MessageType;
  __from: string;
  __protocolVersion: number;
}

export interface CallMessage extends BaseMessage {
  __requireAcknowledge: boolean;
  args: any[];
}

export interface AcknowledgeMessage extends BaseMessage {
  __acknowledged: boolean;
}

export interface ResultMessage extends AcknowledgeMessage {
  result: any;
}

export interface ThirdPartyMethodCallMessage {
  methodName: string;
  args: any[];
  __messageId: string;
}
