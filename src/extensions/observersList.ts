import { MapType } from '../types/MapType';

export const observersList: MapType<any> = [
  { value: 'githubAction', label: 'Github Action' },
  { value: 'ccTray', label: 'CCTray' },
  { value: 'datadogMonitor', label: 'Datadog Monitor' },
  { value: 'sentry', label: 'Sentry' },
  { value: 'newRelic', label: 'New Relic' },
  { value: 'grafana', label: 'Grafana' },
  { value: 'azureDevOps', label: 'Azure DevOps' },
];
