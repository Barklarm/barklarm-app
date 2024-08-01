import { faker } from '@faker-js/faker';
import { Status } from '../../../types/Status';
import { GrafanaConfiguration } from '../../../types/GrafanaConfiguration';
import { Grafana } from './index';

const fetchtMock = jest.fn();
jest.mock('electron-fetch', () => {
  return {
    __esModule: true,
    default: (...all: any) => fetchtMock(...all),
  };
});

describe('NewRelic', () => {
  describe('getState', () => {
    let config: GrafanaConfiguration;
    let observer: Grafana;

    let expectedUrl: string;
    let expectedSite: string;

    beforeEach(() => {
      fetchtMock.mockClear();
      config = {
        type: 'grafana',
        url: faker.internet.url(),
        authToken: faker.lorem.word(),
        alias: faker.lorem.word(),
      };
      expectedUrl = `${config.url}/api/v1/provisioning/alert-rules`;
      expectedSite = `${config.url}/alerting`;
      observer = new Grafana(config);
    });

    it('shoulds return NA status if request return diferent value than 200', async () => {
      fetchtMock.mockResolvedValue({
        json: () => Promise.resolve('kaboom'),
        ok: false,
      });
      const result = await observer.getState();
      expect(fetchtMock).toBeCalledWith(expectedUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${config.authToken}`,
        },
      });
      expect(result).toEqual({
        name: config.alias,
        status: Status.NA,
        link: expectedSite,
      });
    });
    it('shoulds return SUCCESS status if request return empty violations array', async () => {
      fetchtMock.mockResolvedValue({
        json: () =>
          Promise.resolve([
            {
              execErrState: 'Success',
            },
            {
              execErrState: 'Success',
            },
            {
              execErrState: 'Success',
            },
          ]),
        ok: true,
      });
      const result = await observer.getState();
      expect(fetchtMock).toBeCalledWith(expectedUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${config.authToken}`,
        },
      });
      expect(result).toEqual({
        name: config.alias,
        status: Status.SUCCESS,
        link: expectedSite,
      });
    });
    it('shoulds return FAILURE status if request have active alarms', async () => {
      fetchtMock.mockResolvedValue({
        json: () =>
          Promise.resolve([
            {
              execErrState: 'Error',
            },
            {
              execErrState: 'Success',
            },
            {
              execErrState: 'Success',
            },
          ]),
        ok: true,
      });
      const result = await observer.getState();
      expect(fetchtMock).toBeCalledWith(expectedUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${config.authToken}`,
        },
      });
      expect(result).toEqual({
        name: config.alias,
        status: Status.FAILURE,
        link: expectedSite,
      });
    });
  });
});
