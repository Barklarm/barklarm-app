import { State } from './State';

export abstract class Observer {
  protected alias: string;
  protected backlogUrl: string;
  protected muted: boolean;

  constructor(alias: string, backlogUrl: string, muted: boolean) {
    this.alias = alias;
    this.backlogUrl = backlogUrl;
    this.muted = muted;
  }

  abstract getState(): Promise<State>;
}
