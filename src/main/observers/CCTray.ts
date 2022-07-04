import { State } from '../../types/State';
import { Observer } from '../../types/Observer';
import { CCTrayConfiguration } from '../../types/CCTrayConfiguration';
import { Status } from '../../types/Status';
import { XMLParser } from 'fast-xml-parser';
import fetch from 'electron-fetch';

export class CCTray implements Observer {
  private readonly url: string;
  private readonly alias: string;
  private readonly projectName: string;
  private readonly parser: XMLParser;
  private readonly statusMap: any = {
    Success: Status.SUCCESS,
    Failure: Status.FAILURE,
    Exception: Status.FAILURE,
    Unknown: Status.NA,
  };

  constructor({ url, alias, name }: CCTrayConfiguration) {
    this.url = url;
    this.alias = alias || `CCTray: ${name || url}`;
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
      if (!response.ok)
        return {
          name: this.alias,
          status: Status.NA,
          link: this.url,
        };
      const projects = this.parser.parse(await response.text()).Projects;

      const { activity, lastBuildStatus, webUrl } = this.getProject(projects.Project, this.projectName);
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
    } catch (_) {
      return {
        name: this.alias,
        status: Status.NA,
        link: this.url,
      };
    }
  }
}
