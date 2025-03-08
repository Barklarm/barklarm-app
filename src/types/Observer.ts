import { State } from './State';

export abstract class Observer {
  protected alias: string;
  protected issueEndpoint: string;
  protected muted: boolean;

  constructor(alias: string, issueEndpoint: string, muted: boolean) {
    this.alias = alias;
    this.issueEndpoint = issueEndpoint;
    this.muted = muted;
  }

  abstract getState(): Promise<State>;
}
