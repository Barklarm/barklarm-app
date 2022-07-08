import { State } from '../../types/State';
import { Observer } from '../../types/Observer';
import { SentryConfiguration } from '../../types/SentryConfiguration';
import { Status } from '../../types/Status';
import fetch from 'electron-fetch';

export class Sentry implements Observer {
  private readonly url: string;
  private readonly site: string;
  private readonly alias: string;
  private readonly authToken: string;

  constructor({ organization, project, authToken, alias }: SentryConfiguration) {
    this.url = `https://sentry.io/api/0/projects/${organization}/${project}/issues/`;
    this.site = `https://sentry.io/organizations/${organization}/projects/${project}`;
    this.alias = alias || `Sentry: ${organization}/${project}`;
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
      if (!response.ok)
        return {
          name: this.alias,
          status: Status.NA,
          link: this.site,
        };
      const body = await response.json();
      if (body.length !== 0)
        return {
          name: this.alias,
          status: Status.FAILURE,
          link: this.site,
        };
      return {
        name: this.alias,
        status: Status.SUCCESS,
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
}
