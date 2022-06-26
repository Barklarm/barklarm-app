import { ObserverConfiguration } from './ObserverConfiguration';

export type DetadogMonitorConfiguration = ObserverConfiguration & {
  site: string;
  apiKey: string;
  appKey: string;
  monitorId: number;
};
