import { Observer } from '../../../types/Observer';
import { State } from '../../../types/State';
import { Status } from '../../../types/Status';
import opsgenie from 'opsgenie-sdk';
import { OpsgenieConfiguration } from '../../../types/OpsGenieConfiguration';

const promisify =
  (fun: any) =>
  (...args: any[]) =>
    new Promise((resolve, reject) =>
      fun(...args, (error: any, result: any) => (error ? reject(error) : resolve(result)))
    );

export class Opsgenie implements Observer {
  private alias: string;
  private host: string;
  private identifier: any;

  constructor({ apiKey, host, identifier, alias }: OpsgenieConfiguration) {
    opsgenie.configure({
      api_key: apiKey,
      host: `https://api.${host}`,
    });
    this.host = host;
    this.identifier = identifier;
    this.alias = alias || `OpsGenie: ${host}/${identifier}`;
  }

  public async getState(): Promise<State> {
    try {
      process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
      const getAlert = promisify(opsgenie.alertV2.get);
      const result: any = await getAlert({ identifier: this.identifier, identifierType: 'id' });
      return {
        name: this.alias,
        status: result.data.status === 'open' ? Status.FAILURE : Status.SUCCESS,
        link: `https://app.${this.host}/alert/detail/${this.identifier}/details`,
      };
    } catch (error) {
      console.error(error);
      return {
        name: this.alias,
        status: Status.NA,
        link: `https://app.${this.host}/alert/detail/${this.identifier}/details`,
      };
    }
  }
}
