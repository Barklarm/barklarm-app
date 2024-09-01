import { ObserverConfiguration } from '@/src/types/ObserverConfiguration';

export type GrafanaConfiguration = ObserverConfiguration & {
  url: string;
  authToken: string;
};
