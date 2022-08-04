import { ObserverConfiguration } from './ObserverConfiguration';

export type NewRelicConfiguration = ObserverConfiguration & {
  site: string;
  apiKey: string;
};
