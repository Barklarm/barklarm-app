import { ObserverConfiguration } from "./ObserverConfiguration";


export type DetadogMonitorConfiguration = ObserverConfiguration & {
  authToken: string;
  site: string;
  apiKey: string;
  appKey: string;
  monitorId: number;
};
