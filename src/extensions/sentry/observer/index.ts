import { State } from '../../../types/State';
import { Observer } from '../../../types/Observer';
import { SentryConfiguration } from '../type';
import { Status } from '../../../types/Status';
import fetch from 'electron-fetch';

export class Sentry extends Observer {
  private readonly url: string;
  private readonly site: string;
  private readonly authToken: string;

  constructor({ organization, project, authToken, alias, backlogUrl, muted }: SentryConfiguration) {
    super(alias || `Sentry: ${organization}/${project}`, backlogUrl, muted);
    this.url = `https://sentry.io/api/0/projects/${organization}/${project}/issues/`;
    this.site = `https://sentry.io/organizations/${organization}/projects/${project}`;
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
      const body = await response.json();
      return {
        name: this.alias,
        status: body.length === 0 ? Status.SUCCESS : Status.FAILURE,
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
}
