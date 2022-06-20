import { GithubActionConfiguration } from "../../types/GithubActionConfiguration";
import { GithubAction } from "./GithubAction";
import { faker } from '@faker-js/faker';
import { Status } from "../../types/Status";

const requestMock = jest.fn();  

jest.mock('octokit', ()=> {
    return {
        Octokit: jest.fn().mockImplementation(() => {
          return {request : requestMock};
        }),
      };
});

describe('Github Action', () => {
    describe('getState', () => {

        let config: GithubActionConfiguration;
        let observer: GithubAction;

        beforeEach(() => {
            requestMock.mockClear()
            config = {
                type: "githubAction",
                authToken: faker.random.word(),
                owner: faker.random.word(),
                repo: faker.random.word(),
                workflowId: faker.random.word(),
                alias: faker.random.word(),
            }
            observer = new GithubAction(config)
        });
        
        it('shoulds return NA status if request return diferent value than 200', async () => {
            requestMock.mockReturnValue({
                status: 400,
                data: {
                    total_count: faker.random.numeric()
                }
            })
            const result = await observer.getState()
            expect(requestMock).toBeCalledWith(
                "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs",
                {
                    owner:config.owner,
                    repo:config.repo,
                    workflow_id:config.workflowId,
                }
            )
            expect(result).toEqual({
                name: config.alias,
                status: Status.NA,
            })
        });
        it('shoulds return NA status if request return no data', async () => {
            requestMock.mockReturnValue({
                status: 200,
                data: {
                    total_count: 0
                }
            })
            const result = await observer.getState()
            expect(result).toEqual({
                name: config.alias,
                status: Status.NA,
            })
        });
        it('shoulds return CHECKING status if no conclusion yet', async () => {
            requestMock.mockReturnValue({
                status: 200,
                data: {
                    total_count: 100,
                    workflow_runs: [
                        {
                            conclusion: null
                        }
                    ]
                }
            })
            const result = await observer.getState()
            expect(result).toEqual({
                name: config.alias,
                status: Status.CHECKING,
            })
        });
        it('shoulds return SUCCESS status if conclusion is equal to success', async () => {
            requestMock.mockReturnValue({
                status: 200,
                data: {
                    total_count: 100,
                    workflow_runs: [
                        {
                            conclusion: "success"
                        }
                    ]
                }
            })
            const result = await observer.getState()
            expect(result).toEqual({
                name: config.alias,
                status: Status.SUCCESS,
            })
        });
        it('shoulds return FAILURE status if conclusion is diferent to success', async () => {
            requestMock.mockReturnValue({
                status: 200,
                data: {
                    total_count: 100,
                    workflow_runs: [
                        {
                            conclusion: faker.random.word()
                        }
                    ]
                }
            })
            const result = await observer.getState()
            expect(result).toEqual({
                name: config.alias,
                status: Status.FAILURE,
            })
        });
        it('shoulds return NA status if exception thrown', async () => {
            requestMock.mockRejectedValue("kaboom");
            const result = await observer.getState()
            expect(result).toEqual({
                name: config.alias,
                status: Status.NA,
            })
        });
        
        it('shoulds owner/repo/workflowId if no alias', async () => {
            requestMock.mockReturnValue({
                status: 200,
                data: {
                    total_count: 100,
                    workflow_runs: [
                        {
                            conclusion: "success"
                        }
                    ]
                }
            })
            config.alias = undefined
            observer = new GithubAction(config)
            const result = await observer.getState()
            expect(result.name).toEqual(`Github: ${config.owner}/${config.repo}/${config.workflowId}`)
        });
    });
});
