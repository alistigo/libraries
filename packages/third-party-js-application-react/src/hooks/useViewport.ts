import { useContext } from 'react';
import {
  ThirdPartyJsViewportContext,
  ThirdPartyJsViewportContextData,
} from '../contexts/viewport';

export default function useViewport(): ThirdPartyJsViewportContextData {
  return useContext<ThirdPartyJsViewportContextData>(
    ThirdPartyJsViewportContext
  );
}
