import { MapType } from '../types/MapType';
import { Observer } from '../types/Observer';
import { Sentry } from './sentry/observer';
import { NewRelic } from './newRelic/observer';
import { Grafana } from './grafana/observer';
import { GithubAction } from './github/observer';
import { CCTray } from './cctray/observer';
import { DatadogMonitor } from './datadog/observer';
import { AzureDevOps } from './azureDevOps/observer';
import { Opsgenie } from './opsgenie/observer';
import { Bitbucket } from './bitbucket/observer';

export const ObserversBuildersMap: MapType<(config: any) => Observer> = {
  githubAction: (configuration: any) => new GithubAction(configuration as any),
  ccTray: (configuration: any) => new CCTray(configuration as any),
  datadogMonitor: (configuration: any) => new DatadogMonitor(configuration as any),
  sentry: (configuration: any) => new Sentry(configuration as any),
  newRelic: (configuration: any) => new NewRelic(configuration as any),
  grafana: (configuration: any) => new Grafana(configuration as any),
  azureDevOps: (configuration: any) => new AzureDevOps(configuration as any),
  opsgenie: (configuration: any) => new Opsgenie(configuration as any),
  bitbucket: (configuration: any) => new Bitbucket(configuration as any),
};
