import { Octokit } from 'octokit';
import { Observer } from '../../../types/Observer';
import { State } from '../../../types/State';
import { GithubActionConfiguration } from '../type';
import { Status } from '../../../types/Status';

export class GithubAction extends Observer {
  private octokit: Octokit;
  private owner: string;
  private repo: string;
  private workflowId: string;
  private baseLink: string;

  constructor({ authToken, owner, repo, workflowId, alias, issueEndpoint, muted }: GithubActionConfiguration) {
    super(alias || `Github: ${owner}/${repo}/${workflowId}`, issueEndpoint, muted);
    this.octokit = new Octokit({
      auth: authToken,
    });
    this.owner = owner;
    this.repo = repo;
    this.workflowId = workflowId;
    this.baseLink = `https://github.com/${owner}/${repo}/actions/`;
  }

  public async getState(): Promise<State> {
    try {
      const response = await this.octokit.request('GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs', {
        owner: this.owner,
        repo: this.repo,
        workflow_id: this.workflowId,
      });
      if (response.status != 200 || response.data.total_count == 0) throw new Error('response is invalid');
      const { conclusion, html_url } = response.data.workflow_runs[0];
      const status = this.getStatus(conclusion);
      return {
        name: this.alias,
        status,
        link: html_url,
        muted: this.muted,
        issueEndpoint: this.issueEndpoint,
      };
    } catch (error) {
      console.error(error);
      return {
        name: this.alias,
        status: Status.NA,
        link: this.baseLink,
        muted: this.muted,
        issueEndpoint: this.issueEndpoint,
      };
    }
  }

  private getStatus(conclusion: string): Status {
    return conclusion == null ? Status.CHECKING : conclusion === 'success' ? Status.SUCCESS : Status.FAILURE;
  }
}
