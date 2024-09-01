import { ObserverConfiguration } from '@/src/types/ObserverConfiguration';

export type OpsgenieConfiguration = ObserverConfiguration & {
  apiKey: string;
  host: string;
  identifier: string;
};
