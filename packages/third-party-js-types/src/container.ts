import {
  ThirdPartyApplicationApi,
  ThirdPartyApplicationOptions,
} from './application';

export interface ThirdPartyContainerApi {
  require: <T>(
    name: string,
    url: string,
    options?: ThirdPartyApplicationOptions<T>
  ) => ThirdPartyApplicationApi;

  unmount: (name: string) => boolean;

  getApplication: (name: string) => ThirdPartyApplicationApi | undefined;
}
