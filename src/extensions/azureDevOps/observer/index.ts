import { Observer } from '../../../types/Observer';
import { State } from '../../../types/State';
import { Status } from '../../../types/Status';
import { getPersonalAccessTokenHandler, WebApi } from 'azure-devops-node-api';
import { AzureDevOpsConfiguration } from '../type';
import { RunResult, RunState } from 'azure-devops-node-api/interfaces/PipelinesInterfaces';

export class AzureDevOps extends Observer {
  private connection: WebApi;
  private project: string;
  private pipelineId: number;
  private orgUrl: string;

  constructor({ authToken, orgUrl, project, pipelineId, alias, backlogUrl, muted }: AzureDevOpsConfiguration) {
    super(alias || `Azure DevOps: ${orgUrl}/${project}`, backlogUrl, muted);
    const authHandler = getPersonalAccessTokenHandler(authToken);
    this.connection = new WebApi(orgUrl, authHandler);
    this.orgUrl = orgUrl;
    this.project = project;
    this.pipelineId = pipelineId;
  }

  public async getState(): Promise<State> {
    try {
      const buildApi = await this.connection.getPipelinesApi();
      const results = await buildApi.listRuns(this.project, this.pipelineId);
      return {
        name: this.alias,
        status: this.getStatus(results[0].state, results[0].result),
        link: results[0]._links.web.href,
        muted: this.muted,
        backlogUrl: this.backlogUrl,
      };
    } catch (error) {
      console.error(error);
      return {
        name: this.alias,
        status: Status.NA,
        link: this.orgUrl,
        muted: this.muted,
        backlogUrl: this.backlogUrl,
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
