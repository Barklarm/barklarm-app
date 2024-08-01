import { ObserverConfiguration } from './ObserverConfiguration';

export type GrafanaConfiguration = ObserverConfiguration & {
  url: string;
  authToken: string;
};
