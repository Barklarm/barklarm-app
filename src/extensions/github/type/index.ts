import { ObserverConfiguration } from '@/src/types/ObserverConfiguration';

export type GithubActionConfiguration = ObserverConfiguration & {
  authToken: string;
  owner: string;
  repo: string;
  workflowId: string;
};
