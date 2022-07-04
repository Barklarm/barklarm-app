import { ObserverConfiguration } from './ObserverConfiguration';

export type CCTrayConfiguration = ObserverConfiguration & {
  url: string;
  name?: string;
};
