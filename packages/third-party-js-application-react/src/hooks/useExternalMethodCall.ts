import { useEffect, useState } from 'react';
import { responseMessageFromEvent } from '@alistigo/third-party-js-application-client';
import { CallMessage, MessageType } from '@alistigo/third-party-js-types';

export interface UseExternalMethodCallResult<T> {
  received: boolean;
  callCount: number;
  data: T;
}

export default function useExternalMethodCall<T>(
  listenMethodName: string,
  handler?: (...args: any[]) => any,
  initValue?: T,
): UseExternalMethodCallResult<T> {
  const [callCount, setCallCount] = useState<number>(0);
  const [data, setData] = useState<any>(initValue);

  const onReceiveMessage = (event: MessageEvent<CallMessage>) => {
    const {
      data: { methodName, __type: type, args = [] },
    } = event;

    if (type !== MessageType.CALL) {
      return;
    }

    if (methodName !== listenMethodName) {
      return;
    }

    const result = handler ? handler.call(null, ...args) : undefined;

    if (typeof result !== 'undefined') {
      if (typeof result === 'object' && typeof result.then === 'function') {
        result.then((r: any) => responseMessageFromEvent(event, r));
      } else {
        responseMessageFromEvent(event, result);
      }
    }

    setData(args);
    setCallCount(callCount + 1);
  };

  useEffect(() => {
    window.addEventListener('message', onReceiveMessage);

    return () => {
      window.removeEventListener('message', onReceiveMessage);
    };
  }, [handler, listenMethodName]);

  return {
    received: callCount > 0,
    callCount,
    data,
  };
}
