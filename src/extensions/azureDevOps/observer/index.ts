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

  constructor({ authToken, orgUrl, project, pipelineId, alias, issueEndpoint, muted }: AzureDevOpsConfiguration) {
    super(alias || `Azure DevOps: ${orgUrl}/${project}`, issueEndpoint, muted);
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
      const status = this.getStatus(results[0].state, results[0].result);
      return {
        name: this.alias,
        status,
        link: results[0]._links.web.href,
        muted: this.muted,
        issueEndpoint: this.issueEndpoint,
        error:
          status === Status.FAILURE
            ? {
                id: results[0].id.toString(),
                description: `${results[0].name} Workflow Failed`,
              }
            : undefined,
      };
    } catch (error) {
      console.error(error);
      return {
        name: this.alias,
        status: Status.NA,
        link: this.orgUrl,
        muted: this.muted,
        issueEndpoint: this.issueEndpoint,
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
