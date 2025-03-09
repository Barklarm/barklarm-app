import { Opsgenie } from '.';
import { expect, describe, it, vi, beforeEach } from 'vitest';
import { faker } from '@faker-js/faker';
import { Status } from '../../../types/Status';
import { OpsgenieConfiguration } from '../type';

const configureMock = vi.fn();
const getAlertV2Mock = vi.fn();

vi.mock('opsgenie-sdk', () => ({
  default: {
    configure: (...args: any[]) => configureMock(...args),
    alertV2: {
      get: (...args: any[]) => getAlertV2Mock(...args),
    },
  },
}));

describe('Opsgenie', () => {
  describe('getState', () => {
    let config: OpsgenieConfiguration;
    let observer: Opsgenie;

    beforeEach(() => {
      configureMock.mockClear();
      getAlertV2Mock.mockClear();
      config = {
        type: 'opsgenie',
        apiKey: faker.lorem.word(),
        host: faker.lorem.word(),
        identifier: faker.lorem.word(),
        alias: faker.lorem.word(),
      };
      observer = new Opsgenie(config);
    });

    const expectedId = 'expectedId';
    const expectedMessage = 'expectedMessage';

    describe.each([
      ['closed', Status.SUCCESS, undefined],
      [
        'open',
        Status.FAILURE,
        {
          description: expectedMessage,
          id: expectedId,
        },
      ],
    ])('%s', (status: string, expected: Status, error: any) => {
      it(`should return ${expected} when status is ${status}`, async () => {
        const ExpectedApiResult = {
          status,
          id: expectedId,
          message: expectedMessage,
        };
        getAlertV2Mock.mockImplementation((_, cb) => cb(undefined, { data: ExpectedApiResult }));
        const resultCall = await observer.getState();
        expect(getAlertV2Mock).toBeCalledWith(
          {
            identifier: config.identifier,
            identifierType: 'id',
          },
          expect.anything()
        );
        expect(resultCall).toEqual({
          name: config.alias,
          status: expected,
          link: `https://app.${config.host}/alert/detail/${config.identifier}/details`,
          muted: undefined,
          issueEndpoint: undefined,
          error,
        });
      });
    });
  });
});
