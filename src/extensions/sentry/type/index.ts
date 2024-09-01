import { ObserverConfiguration } from '@/src/types/ObserverConfiguration';

export type SentryConfiguration = ObserverConfiguration & {
  organization: string;
  project: string;
  authToken: string;
};
