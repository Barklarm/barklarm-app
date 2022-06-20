import { Octokit } from "octokit";
import { Observer } from "../../types/Observer";
import { State } from "../../types/State";
import { GithubActionConfiguration } from "../../types/GithubActionConfiguration";
import { Status } from "../../types/Status";

export class GithubAction implements Observer {
  private octokit: Octokit;
  private owner: string;
  private repo: string;
  private workflowId: string;

  private alias: string;

  constructor({
    authToken,
    owner,
    repo,
    workflowId,
    alias,
  }: GithubActionConfiguration) {
    this.octokit = new Octokit({
      auth: authToken,
    });
    this.owner = owner;
    this.repo = repo;
    this.workflowId = workflowId;
    this.alias = alias;
  }

  public async getState(): Promise<State> {
    const name = this.resolveAlias();
    try {
      const response = await this.octokit.request(
        "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs",
        {
          owner: this.owner,
          repo: this.repo,
          workflow_id: this.workflowId,
        }
      );
      if (response.status != 200 || response.data.total_count == 0)
        return {
          name,
          status: Status.NA,
        };
      const { conclusion } = response.data.workflow_runs[0];
      if (conclusion == null) {
        return {
          name,
          status: Status.CHECKING,
        };
      }
      return {
        name,
        status: conclusion === "success" ? Status.SUCCESS : Status.FAILURE,
      };
    } catch (error) {
      console.error(error);
      return {
        name,
        status: Status.NA,
      };
    }
  }

  private resolveAlias() {
    return (
      this.alias ?? `Github: ${this.owner}/${this.repo}/${this.workflowId}`
    );
  }
}

