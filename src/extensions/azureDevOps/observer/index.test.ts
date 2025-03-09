import { AzureDevOpsConfiguration } from '../type';
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

    const expectedId = faker.lorem.word();
    const expectedName = faker.lorem.word();

    describe.each([
      [RunState.Completed, RunResult.Succeeded, Status.SUCCESS, undefined],
      [
        RunState.Completed,
        RunResult.Failed,
        Status.FAILURE,
        {
          id: expectedId,
          description: `${expectedName} Workflow Failed`,
        },
      ],
      [RunState.Completed, RunResult.Canceled, Status.NA, undefined],
      [RunState.Completed, RunResult.Unknown, Status.NA, undefined],
      [RunState.Canceling, RunResult.Succeeded, Status.CHECKING, undefined],
      [RunState.InProgress, RunResult.Succeeded, Status.CHECKING, undefined],
      [RunState.Unknown, RunResult.Succeeded, Status.CHECKING, undefined],
    ])('%s', (state: RunState, result: RunResult, expected: Status, error: any) => {
      it(`should return ${expected} when state ${state} and result ${result}`, async () => {
        const ExpectedApiResult = {
          state: state,
          result: result,
          id: expectedId,
          name: expectedName,
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
          error,
        });
      });
    });
  });
});
