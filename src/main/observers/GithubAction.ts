import { Octokit } from "octokit";
import { Observer, State, ObserverConfiguration } from "./ObserverManager";



export type GithubActionConfiguration = ObserverConfiguration & {
  authToken: string;
  owner: string;
  repo: string;
  workflowId: string;
}



export class GithubAction implements Observer {
  private octokit: Octokit;
  private owner: string;
  private repo: string;
  private workflowId: string;

  constructor({authToken, owner, repo, workflowId}: GithubActionConfiguration){
      this.octokit = new Octokit({
        auth: authToken
      });
      this.owner=owner;
      this.repo=repo;
      this.workflowId=workflowId;
  }

  public async getState(): Promise<State> {
    const name = `Github: ${this.owner}/${this.repo}/${this.workflowId}`
    try {
        const response = await this.octokit.request('GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs', {
          owner: this.owner,
          repo: this.repo,
          workflow_id: this.workflowId
        })
      if(response.status != 200 && response.data.total_count > 0)
        return {
          name,
          isReachable: false,
        }
      const {conclusion} = response.data.workflow_runs[0]
      if (conclusion == null) {
        return {
          name,
          isReachable: true,
          isRunning: true
        }
      }
      return {
        name,
        isReachable: true,
        isRunning: false,
        isSuccess: conclusion === "success"
      }
    
    } catch (error) {
      console.error(error);
      return {
        name,
        isReachable: false,
      }
    }
  }

}