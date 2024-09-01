import { ObserverConfiguration } from '@/src/types/ObserverConfiguration';

export type NewRelicConfiguration = ObserverConfiguration & {
  site: string;
  apiKey: string;
};
