import { ObserverConfiguration } from './ObserverConfiguration';

export type BitbucketConfiguration = ObserverConfiguration & {
  workspace: string;
  repo: string;
  branch: string;
  authToken: string;
};
