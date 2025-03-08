import { Error } from './Error';
import { Status } from './Status';

export type State = {
  name: string;
  status: Status;
  link: string;
  muted?: boolean;
  issueEndpoint?: string;
  error?: Error;
};
