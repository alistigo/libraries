import { ThirdPartyContainerApi } from '@alistigo/third-party-js-types';
import ThirdPartyContainer from '../classes/ThirdPartyContainer';

declare global {
  interface Window {
    thirdPartyContainer?: ThirdPartyContainerApi;
  }
}

const container = new ThirdPartyContainer();

if (typeof window !== 'undefined' && window && !window.thirdPartyContainer) {
  window.thirdPartyContainer = container;
}

export default container;
