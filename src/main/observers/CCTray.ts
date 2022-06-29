import { State } from '../../types/State';
import { Observer } from '../../types/Observer';
import { CCTrayConfiguration } from '../../types/CCTrayConfiguration';
import { Status } from '../../types/Status';
import { XMLParser } from 'fast-xml-parser';
import fetch from 'electron-fetch';

export class CCTray implements Observer {
  private readonly url: string;
  private readonly alias: string;
  private readonly parser: XMLParser;
  private readonly statusMap: any = {
    Success: Status.SUCCESS,
    Failure: Status.FAILURE,
    Exception: Status.FAILURE,
    Unknown: Status.NA,
  };

  constructor({ url, alias }: CCTrayConfiguration) {
    this.url = url;
    this.alias = alias || `CCTray: ${url}`;
    this.parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '',
      allowBooleanAttributes: true,
    });
  }

  public async getState(): Promise<State> {
    const response = await fetch(this.url, {
      method: 'GET',
    });
    if (!response.ok)
      return {
        name: this.alias,
        status: Status.NA,
        link: this.url,
      };
    const projects = this.parser.parse(await response.text()).Projects;

    const { activity, lastBuildStatus, webUrl } = projects.Project;
    if (activity !== 'Sleeping')
      return {
        name: this.alias,
        status: Status.CHECKING,
        link: webUrl,
      };
    return {
      name: this.alias,
      status: this.statusMap[lastBuildStatus],
      link: webUrl,
    };
  }
}
