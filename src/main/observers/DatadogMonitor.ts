import { State } from "../../types/State";
import { Observer } from "../../types/Observer";
import { DetadogMonitorConfiguration } from "../../types/DetadogMonitorConfiguration";
import { client, v1 } from "@datadog/datadog-api-client";
import { Status } from "../../types/Status";
import { ServerConfiguration } from "@datadog/datadog-api-client/dist/packages/datadog-api-client-common";
import { OK, WARN, ALERT } from "@datadog/datadog-api-client/dist/packages/datadog-api-client-v1/models/MonitorOverallStates";


export class DatadogMonitor implements Observer {
    private readonly alias: string;
    private readonly monitorId: number;
    private readonly apiInstance: v1.MonitorsApi;
    constructor({ alias, site, apiKey, appKey, monitorId }: DetadogMonitorConfiguration) {
        this.alias = alias || `Datadog: ${monitorId}`
        this.monitorId = monitorId
        const configuration : client.Configuration = client.createConfiguration({
            baseServer: new ServerConfiguration("https://{subdomain}.{site}", {
                site: site,
                subdomain: "api",
                }),          
            authMethods: {
                apiKeyAuth: apiKey,
                appKeyAuth: appKey
            }
        });
        this.apiInstance = new v1.MonitorsApi(configuration);
    }
    public async getState(): Promise<State> {
        try {
            const data: v1.Monitor = await this.apiInstance.getMonitor({
                monitorId: this.monitorId,
            })
            if(data.overallState === OK )
                return {
                    name: this.alias,
                    status: Status.SUCCESS,
                };
            if(data.overallState === ALERT || data.overallState === WARN)
                return {
                    name: this.alias,
                    status: Status.FAILURE,
                };
            return {
                name: this.alias,
                status: Status.NA,
            };
        } catch (error) {
            console.error(error)
            return {
                name: this.alias,
                status: Status.NA,
            };
        }
    }

}