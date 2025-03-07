import { State } from '../../../types/State';
import { Observer } from '../../../types/Observer';
import { Status } from '../../../types/Status';
import { GrafanaConfiguration } from '../type';
import fetch from 'electron-fetch';

export class Grafana extends Observer {
  private readonly url: string;
  private readonly site: string;
  private readonly authToken: string;

  constructor({ url, alias, authToken, backlogUrl, muted }: GrafanaConfiguration) {
    super(alias || `Grafana: ${url}`, backlogUrl, muted);
    this.url = `${url}/api/v1/provisioning/alert-rules`;
    this.site = `${url}/alerting`;
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
      const alertRules = await response.json();
      return {
        name: this.alias,
        status: this.getStatus(alertRules),
        link: this.site,
        muted: this.muted,
        backlogUrl: this.backlogUrl,
      };
    } catch (_) {
      return {
        name: this.alias,
        status: Status.NA,
        link: this.site,
        muted: this.muted,
        backlogUrl: this.backlogUrl,
      };
    }
  }

  private getStatus(alertRules: any[]): Status {
    return alertRules.some((alertRule: any) => alertRule.execErrState === 'Error') ? Status.FAILURE : Status.SUCCESS;
  }
}
