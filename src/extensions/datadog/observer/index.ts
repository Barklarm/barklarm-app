import { State } from '../../../types/State';
import { Observer } from '../../../types/Observer';
import { DetadogMonitorConfiguration } from '../type';
import { client, v1 } from '@datadog/datadog-api-client';
import { Status } from '../../../types/Status';
import { ServerConfiguration } from '@datadog/datadog-api-client/dist/packages/datadog-api-client-common';
import {
  OK,
  WARN,
  ALERT,
  IGNORED,
  NO_DATA,
  SKIPPED,
  UNKNOWN,
} from '@datadog/datadog-api-client/dist/packages/datadog-api-client-v1/models/MonitorOverallStates';

export class DatadogMonitor extends Observer {
  private readonly site: string;
  private readonly monitorId: number;
  private readonly apiInstance: v1.MonitorsApi;

  private readonly overalStateMap: any = {
    [OK]: Status.SUCCESS,
    [ALERT]: Status.FAILURE,
    [WARN]: Status.FAILURE,
    [IGNORED]: Status.NA,
    [NO_DATA]: Status.NA,
    [SKIPPED]: Status.NA,
    [UNKNOWN]: Status.NA,
  };
  constructor({ alias, site, apiKey, appKey, monitorId, issueEndpoint, muted }: DetadogMonitorConfiguration) {
    super(alias || `Datadog: ${monitorId}`, issueEndpoint, muted);
    this.site = site;
    this.monitorId = monitorId;
    const configuration: client.Configuration = client.createConfiguration({
      baseServer: new ServerConfiguration('https://{subdomain}.{site}', {
        site: site,
        subdomain: 'api',
      }),
      authMethods: {
        apiKeyAuth: apiKey,
        appKeyAuth: appKey,
      },
    });
    this.apiInstance = new v1.MonitorsApi(configuration);
  }
  public async getState(): Promise<State> {
    const link = `https://app.${this.site}/monitors/${this.monitorId}`;
    try {
      const data: v1.Monitor = await this.apiInstance.getMonitor({
        monitorId: this.monitorId,
      });
      return {
        name: this.alias,
        status: this.overalStateMap[data.overallState as any],
        link,
        muted: this.muted,
        issueEndpoint: this.issueEndpoint,
      };
    } catch (error) {
      console.error(error);
      return {
        name: this.alias,
        status: Status.NA,
        link,
        muted: this.muted,
        issueEndpoint: this.issueEndpoint,
      };
    }
  }
}
