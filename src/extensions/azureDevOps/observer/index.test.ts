import { AzureDevOpsConfiguration } from '../../../types/AzureDevOpsConfiguration';
import { AzureDevOps } from '.';
import { expect, describe, it, vi, beforeEach } from 'vitest';
import { faker } from '@faker-js/faker';
import { Status } from '../../../types/Status';
import { RunResult, RunState } from 'azure-devops-node-api/interfaces/PipelinesInterfaces';

const getPersonalAccessTokenHandlerMock = vi.fn();
const listRunsMock = vi.fn();
const getPipelinesApiMock = vi.fn().mockReturnValue({
  listRuns: listRunsMock,
});

vi.mock('azure-devops-node-api', () => ({
  getPersonalAccessTokenHandler: () => getPersonalAccessTokenHandlerMock(),
  WebApi: vi.fn().mockReturnValue({
    getPipelinesApi: () => getPipelinesApiMock(),
  }),
}));

describe('Azure DevOps', () => {
  describe('getState', () => {
    let config: AzureDevOpsConfiguration;
    let observer: AzureDevOps;

    beforeEach(() => {
      getPersonalAccessTokenHandlerMock.mockClear();
      listRunsMock.mockClear();
      config = {
        type: 'azureDevOps',
        authToken: faker.lorem.word(),
        project: faker.lorem.word(),
        orgUrl: faker.lorem.word(),
        pipelineId: faker.number.int(),
        alias: faker.lorem.word(),
      };
      observer = new AzureDevOps(config);
    });

    describe.each([
      [RunState.Completed, RunResult.Succeeded, Status.SUCCESS],
      [RunState.Completed, RunResult.Failed, Status.FAILURE],
      [RunState.Completed, RunResult.Canceled, Status.NA],
      [RunState.Completed, RunResult.Unknown, Status.NA],
      [RunState.Canceling, RunResult.Succeeded, Status.CHECKING],
      [RunState.InProgress, RunResult.Succeeded, Status.CHECKING],
      [RunState.Unknown, RunResult.Succeeded, Status.CHECKING],
    ])('%s', (state: RunState, result: RunResult, expected: Status) => {
      it(`should return ${expected} when state ${state} and result ${result}`, async () => {
        const ExpectedApiResult = {
          state: state,
          result: result,
          _links: {
            web: {
              href: faker.lorem.word(),
            },
          },
        };
        listRunsMock.mockReturnValue([ExpectedApiResult]);
        const resultCall = await observer.getState();
        expect(resultCall).toEqual({
          name: config.alias,
          status: expected,
          link: ExpectedApiResult._links.web.href,
        });
      });
    });

    it.skip('shoulds return Success status if request completed & succeded', async () => {
      const ExpectedApiResult = {
        state: RunState.Completed,
        result: RunResult.Succeeded,
        _links: {
          web: {
            href: faker.lorem.word(),
          },
        },
      };
      listRunsMock.mockReturnValue([ExpectedApiResult]);
      const result = await observer.getState();
      expect(result).toEqual({
        name: config.alias,
        status: Status.SUCCESS,
        link: ExpectedApiResult._links.web.href,
      });
    });
  });
});
