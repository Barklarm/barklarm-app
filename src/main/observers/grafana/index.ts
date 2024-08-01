import { State } from '../../../types/State';
import { Observer } from '../../../types/Observer';
import { Status } from '../../../types/Status';
import { GrafanaConfiguration } from '../../../types/GrafanaConfiguration';
import fetch from 'electron-fetch';

export class Grafana implements Observer {
  private readonly url: string;
  private readonly site: string;
  private readonly alias: string;
  private readonly authToken: string;

  constructor({ url, alias, authToken }: GrafanaConfiguration) {
    this.url = `${url}/api/v1/provisioning/alert-rules`;
    this.site = `${url}/alerting`;
    this.alias = alias || `Grafana: ${url}`;
    this.authToken = authToken;
  }
  public async getState(): Promise<State> {
    try {
      const response = await fetch(this.url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.authToken}`,
        },
      });
      if (!response.ok) throw new Error('response is invalid');
      const alerRules = await response.json();
      return {
        name: this.alias,
        status: this.getStatus(alerRules),
        link: this.site,
      };
    } catch (_) {
      return {
        name: this.alias,
        status: Status.NA,
        link: this.site,
      };
    }
  }

  private getStatus(alertRules: any[]): Status {
    return alertRules.some((alertRule: any) => alertRule.execErrState === 'Error') ? Status.FAILURE : Status.SUCCESS;
  }
}
