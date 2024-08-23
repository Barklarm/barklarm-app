import { ObserverConfiguration } from './ObserverConfiguration';

export type OpsgenieConfiguration = ObserverConfiguration & {
  apiKey: string;
  host: string;
  identifier: string;
};
