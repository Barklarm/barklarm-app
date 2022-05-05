import { Octokit } from "octokit";

type GithubActionConfiguration={
  authToken: string;
  owner: string;
  repo: string;
  workflowId: string;
}

type State = {
  isReachable: boolean
  isRunning?: boolean
  isSuccess?: boolean 
}

class GithubAction {
  private octokit: Octokit;
  private owner: string;
  private repo: string;
  private workflowId: string;

  construtor({authToken, owner, repo, workflowId}: GithubActionConfiguration){
      this.octokit = new Octokit({
        auth: authToken
      });
      this.owner=owner;
      this.repo=repo;
      this.workflowId=workflowId;
  }

  public async getState(): Promise<State> {
    const response = await this.octokit.request('GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs', {
      owner: this.owner,
      repo: this.repo,
      workflow_id: this.workflowId
    })
    if(response.status != 200 && response.data.total_count > 0)
      return {
        isReachable: false,
      }
    const {conclusion} = response.data.workflow_runs[0]
    if (conclusion == null) {
      return {
        isReachable: true,
        isRunning: true
      }
    }
    return {
      isReachable: true,
      isRunning: true,
      isSuccess: conclusion === "success"
    }
  }

}
/*
  
  await octokit.request('GET /repos/{owner}/{repo}/actions/jobs/{job_id}', {
    owner: 'OWNER',
    repo: 'REPO',
    job_id: 'JOB_ID'
  })*/