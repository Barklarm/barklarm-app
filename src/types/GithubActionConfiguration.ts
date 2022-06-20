import { ObserverConfiguration } from "./ObserverConfiguration";


export type GithubActionConfiguration = ObserverConfiguration & {
  authToken: string;
  owner: string;
  repo: string;
  workflowId: string;
  alias?: string;
};
