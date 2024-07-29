import { getHostClient } from '@alistigo/third-party-js-application-client';

const params = new URLSearchParams(document.location.search);
const loadTime: number = parseInt(params.get('loadTime') || '0', 10);

setTimeout(() => {
  getHostClient();
}, loadTime);
