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

    describe.each([
      ['closed', Status.SUCCESS],
      ['open', Status.FAILURE],
    ])('%s', (status: string, expected: Status) => {
      it(`should return ${expected} when status is ${status}`, async () => {
        const ExpectedApiResult = {
          status,
        };
        getAlertV2Mock.mockImplementation((_, cb) => cb(undefined, { data: ExpectedApiResult }));
        const resultCall = await observer.getState();
        expect(getAlertV2Mock).toBeCalledWith(
          { identifier: config.identifier, identifierType: 'id' },
          expect.anything()
        );
        expect(resultCall).toEqual({
          name: config.alias,
          status: expected,
          link: `https://app.${config.host}/alert/detail/${config.identifier}/details`,
        });
      });
    });
  });
});
