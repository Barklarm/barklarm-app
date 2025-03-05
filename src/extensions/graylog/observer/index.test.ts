import { faker } from '@faker-js/faker';
import { Status } from '../../../types/Status';
import { expect, describe, it, vi, beforeEach } from 'vitest';
import { GraylogConfiguration } from '../type';
import { Graylog } from '.';

const fetchtMock = vi.fn();
vi.mock('electron-fetch', () => {
  return {
    __esModule: true,
    default: (...all: any) => fetchtMock(...all),
  };
});

describe('Graylog', () => {
  describe('getState without streamId', () => {
    let config: GraylogConfiguration;
    let observer: Graylog;

    let expectedUrl: string;
    let expectedSite: string;

    beforeEach(() => {
      fetchtMock.mockClear();
      config = {
        type: 'graylog',
        url: faker.internet.url(),
        username: faker.lorem.word(),
        password: faker.lorem.word(),
        alias: faker.lorem.word(),
      };
      expectedUrl = `${config.url}/api/streams/alerts/paginated?skip=0&limit=5&state=unresolved`;
      expectedSite = `${config.url}/alerts`;
      observer = new Graylog(config);
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
          Authorization: `Basic ${btoa(config.username + ':' + config.password)}`,
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
          Promise.resolve({
            total: 0,
            alerts: [],
          }),
        ok: true,
      });
      const result = await observer.getState();
      expect(fetchtMock).toBeCalledWith(expectedUrl, {
        method: 'GET',
        headers: {
          Authorization: `Basic ${btoa(config.username + ':' + config.password)}`,
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
          Promise.resolve({
            total: 1,
            alerts: [],
          }),
        ok: true,
      });
      const result = await observer.getState();
      expect(fetchtMock).toBeCalledWith(expectedUrl, {
        method: 'GET',
        headers: {
          Authorization: `Basic ${btoa(config.username + ':' + config.password)}`,
        },
      });
      expect(result).toEqual({
        name: config.alias,
        status: Status.FAILURE,
        link: expectedSite,
      });
    });
  });
  describe('getState with streamId', () => {
    let config: GraylogConfiguration;
    let observer: Graylog;

    let expectedUrl: string;
    let expectedSite: string;

    beforeEach(() => {
      fetchtMock.mockClear();
      config = {
        type: 'graylog',
        url: faker.internet.url(),
        username: faker.lorem.word(),
        password: faker.lorem.word(),
        alias: faker.lorem.word(),
        streamId: faker.lorem.word(),
      };
      expectedUrl = `${config.url}/api/streams/${config.streamId}/alerts/paginated?skip=0&limit=5&state=unresolved`;
      expectedSite = `${config.url}/alerts/${config.streamId}`;
      observer = new Graylog(config);
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
          Authorization: `Basic ${btoa(config.username + ':' + config.password)}`,
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
          Promise.resolve({
            total: 0,
            alerts: [],
          }),
        ok: true,
      });
      const result = await observer.getState();
      expect(fetchtMock).toBeCalledWith(expectedUrl, {
        method: 'GET',
        headers: {
          Authorization: `Basic ${btoa(config.username + ':' + config.password)}`,
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
          Promise.resolve({
            total: 1,
            alerts: [],
          }),
        ok: true,
      });
      const result = await observer.getState();
      expect(fetchtMock).toBeCalledWith(expectedUrl, {
        method: 'GET',
        headers: {
          Authorization: `Basic ${btoa(config.username + ':' + config.password)}`,
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
