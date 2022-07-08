import { ObserverConfiguration } from './ObserverConfiguration';

export type SentryConfiguration = ObserverConfiguration & {
  organization: string;
  project: string;
  authToken: string;
};
