import { State } from '../../../types/State';
import { Observer } from '../../../types/Observer';
import { DetadogMonitorConfiguration } from '../../../types/DetadogMonitorConfiguration';
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

export class DatadogMonitor implements Observer {
  private readonly alias: string;
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
  constructor({ alias, site, apiKey, appKey, monitorId }: DetadogMonitorConfiguration) {
    this.alias = alias || `Datadog: ${monitorId}`;
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
      };
    } catch (error) {
      console.error(error);
      return {
        name: this.alias,
        status: Status.NA,
        link,
      };
    }
  }
}
