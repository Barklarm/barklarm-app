import { State } from '../../../types/State';
import { Observer } from '../../../types/Observer';
import { CCTrayConfiguration } from '../type';
import { Status } from '../../../types/Status';
import { XMLParser } from 'fast-xml-parser';
import fetch from 'electron-fetch';

export class CCTray extends Observer {
  private readonly url: string;
  private readonly projectName: string;
  private readonly parser: XMLParser;
  private readonly statusMap: any = {
    Success: Status.SUCCESS,
    Failure: Status.FAILURE,
    Exception: Status.FAILURE,
    Unknown: Status.NA,
  };

  constructor({ url, alias, name, backlogUrl, muted }: CCTrayConfiguration) {
    super(alias || `CCTray: ${name || url}`, backlogUrl, muted);
    this.url = url;
    this.projectName = name;
    this.parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '',
      allowBooleanAttributes: true,
    });
  }

  private getProject(projects: any | any[], projectName: string): any {
    const projectsList = (Array.isArray(projects) ? projects : [projects]) || [];
    if (!projectName) return projectsList[0];
    return projectsList.find((project) => project.name === projectName);
  }
  public async getState(): Promise<State> {
    try {
      const response = await fetch(this.url, {
        method: 'GET',
      });
      if (!response.ok) throw new Error('response is invalid');
      const projects = this.parser.parse(await response.text()).Projects;
      const { activity, lastBuildStatus, webUrl } = this.getProject(projects.Project, this.projectName);
      return {
        name: this.alias,
        status: this.getStatus(activity, lastBuildStatus),
        link: webUrl,
        muted: this.muted,
        backlogUrl: this.backlogUrl,
      };
    } catch (_) {
      return {
        name: this.alias,
        status: Status.NA,
        link: this.url,
        muted: this.muted,
        backlogUrl: this.backlogUrl,
      };
    }
  }
  private getStatus(activity: string, lastBuildStatus: string): Status {
    return activity !== 'Sleeping' ? Status.CHECKING : this.statusMap[lastBuildStatus];
  }
}
