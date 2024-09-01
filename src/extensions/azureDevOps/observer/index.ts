import { Observer } from '../../../types/Observer';
import { State } from '../../../types/State';
import { Status } from '../../../types/Status';
import { getPersonalAccessTokenHandler, WebApi } from 'azure-devops-node-api';
import { AzureDevOpsConfiguration } from '../type';
import { RunResult, RunState } from 'azure-devops-node-api/interfaces/PipelinesInterfaces';

export class AzureDevOps implements Observer {
  private connection: WebApi;
  private project: string;
  private pipelineId: number;
  private orgUrl: string;

  private alias: string;

  constructor({ authToken, orgUrl, project, pipelineId, alias }: AzureDevOpsConfiguration) {
    const authHandler = getPersonalAccessTokenHandler(authToken);
    this.connection = new WebApi(orgUrl, authHandler);
    this.orgUrl = orgUrl;
    this.project = project;
    this.pipelineId = pipelineId;
    this.alias = alias || `Azure DevOps: ${orgUrl}/${this.project}`;
  }

  public async getState(): Promise<State> {
    try {
      const buildApi = await this.connection.getPipelinesApi();
      const results = await buildApi.listRuns(this.project, this.pipelineId);
      return {
        name: this.alias,
        status: this.getStatus(results[0].state, results[0].result),
        link: results[0]._links.web.href,
      };
    } catch (error) {
      console.error(error);
      return {
        name: this.alias,
        status: Status.NA,
        link: this.orgUrl,
      };
    }
  }

  private getStatus(state: RunState, result: RunResult): Status {
    return state !== RunState.Completed
      ? Status.CHECKING
      : result === RunResult.Succeeded
        ? Status.SUCCESS
        : result === RunResult.Failed
          ? Status.FAILURE
          : Status.NA;
  }
}
