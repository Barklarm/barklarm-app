import { State } from '../../../types/State';
import { Observer } from '../../../types/Observer';
import { Status } from '../../../types/Status';
import { GraylogConfiguration } from '../type';
import fetch from 'electron-fetch';

export class Graylog implements Observer {
  private readonly url: string;
  private readonly site: string;
  private readonly alias: string;
  private readonly username: string;
  private readonly password: string;

  constructor({ url, alias, username, password }: GraylogConfiguration) {
    this.url = `${url}/streams/alerts/paginated`;
    this.site = `${url}/alerts`;
    this.alias = alias || `Graylog: ${url}`;
    this.username = username;
    this.password = password;
  }
  public async getState(): Promise<State> {
    try {
      const params = new URLSearchParams();
      params.append('username', 'example');
      const response = await fetch(`${this.url}?skip=0&limit=300&state=unresolved`, {
        method: 'GET',
        headers: {
          Authorization: `Basic ${btoa(this.username + ':' + this.password)}`,
        },
      });
      if (!response.ok) throw new Error('response is invalid');
      const alertRules = await response.json();
      return {
        name: this.alias,
        status: alertRules.total > 0 ? Status.FAILURE : Status.SUCCESS,
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
