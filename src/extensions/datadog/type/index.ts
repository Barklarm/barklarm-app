import { ObserverConfiguration } from '@/src/types/ObserverConfiguration';

export type DetadogMonitorConfiguration = ObserverConfiguration & {
  site: string;
  apiKey: string;
  appKey: string;
  monitorId: number;
};
