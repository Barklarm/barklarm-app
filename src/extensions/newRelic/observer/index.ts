import { State } from '../../../types/State';
import { Observer } from '../../../types/Observer';
import { NewRelicConfiguration } from '../type';
import { Status } from '../../../types/Status';
import fetch from 'electron-fetch';

export class NewRelic extends Observer {
  private readonly url: string;
  private readonly site: string;
  private readonly apiKey: string;

  constructor({ site, apiKey, alias, issueEndpoint, muted }: NewRelicConfiguration) {
    super(alias || `New Relic: alerts`, issueEndpoint, muted);
    this.url = `https://api.${site}/v2/alerts_violations.json`;
    this.site = `https://one.${site}/nrai`;
    this.apiKey = apiKey;
  }

  public async getState(): Promise<State> {
    try {
      const response = await fetch(this.url, {
        method: 'GET',
        headers: {
          'X-Api-Key': `${this.apiKey}`,
        },
      });
      if (!response.ok) throw new Error('response is invalid');
      const body = await response.json();
      return {
        name: this.alias,
        status: body.violations.length === 0 ? Status.SUCCESS : Status.FAILURE,
        link: this.site,
        muted: this.muted,
        issueEndpoint: this.issueEndpoint,
      };
    } catch (_) {
      return {
        name: this.alias,
        status: Status.NA,
        link: this.site,
        muted: this.muted,
        issueEndpoint: this.issueEndpoint,
      };
    }
  }
}
