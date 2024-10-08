import { ObserverConfiguration } from '@/src/types/ObserverConfiguration';

export type CCTrayConfiguration = ObserverConfiguration & {
  url: string;
  name?: string;
};
