import { MapType } from '../../../../types/MapType';

export const observersTitleBuilderMap: MapType<(observable: any) => string> = {
  githubAction: (observable: any) =>
    `Github: ${observable.alias || `${observable.owner}/${observable.repo}/${observable.workflowId}`}`,
  ccTray: (observable: any) => `CCTray: ${observable.alias || observable.name || observable.url}`,
  datadogMonitor: (observable: any) => `Datadog: ${observable.alias || `${observable.site}/${observable.monitorId}`}`,
  sentry: (observable: any) => `Sentry: ${observable.alias || `${observable.organization}/${observable.project}`}`,
  newRelic: (observable: any) => `NewRelic: ${observable.alias || `alerts`}`,
};
