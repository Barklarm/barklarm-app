import { ObserverConfiguration } from '@/src/types/ObserverConfiguration';

export type GraylogConfiguration = ObserverConfiguration & {
  url: string;
  username: string;
  password: string;
};
