import { ObserverConfiguration } from './ObserverConfiguration';

export type AzureDevOpsConfiguration = ObserverConfiguration & {
  authToken: string;
  orgUrl: string;
  project: string;
  pipelineId: number;
};
