import { DatadogMonitor } from './DatadogMonitor';
import { faker } from '@faker-js/faker';
import { Status } from '../../types/Status';
import { DetadogMonitorConfiguration } from '../../types/DetadogMonitorConfiguration';
import { v1 } from '@datadog/datadog-api-client';
import { ServerConfiguration } from '@datadog/datadog-api-client/dist/packages/datadog-api-client-common';

const createConfigurationMock = jest.fn();
const getMonitorMock = jest.fn();
const MonitorApiMock = {
  getMonitor: getMonitorMock,
};
const serverConfigurationMock = {
  some: faker.lorem.word(),
};

jest.mock('@datadog/datadog-api-client', () => {
  return {
    __esModule: true,
    client: {
      createConfiguration: (...all: any) => createConfigurationMock(...all),
    },
    v1: {
      MonitorsApi: jest.fn().mockImplementation(() => MonitorApiMock),
    },
  };
});

jest.mock('@datadog/datadog-api-client/dist/packages/datadog-api-client-common', () => {
  return {
    ServerConfiguration: jest.fn().mockImplementation(() => serverConfigurationMock),
  };
});

describe('Datadog', () => {
  describe('getState', () => {
    const configurationMockReturn = {
      value: faker.random.alpha(),
    };
    let expectLink: string;
    let config: DetadogMonitorConfiguration;
    let observer: DatadogMonitor;

    beforeEach(() => {
      createConfigurationMock.mockClear();
      getMonitorMock.mockClear();
      config = {
        type: 'datadogMonitor',
        site: faker.internet.url(),
        apiKey: faker.lorem.word(),
        appKey: faker.lorem.word(),
        monitorId: faker.number.int(),
        alias: faker.lorem.word(),
      };
      expectLink = `https://app.${config.site}/monitors/${config.monitorId}`;

      createConfigurationMock.mockReturnValue(configurationMockReturn);
      observer = new DatadogMonitor(config);
    });

    it('should initialize api instance in constructor', () => {
      expect(ServerConfiguration).toBeCalledWith('https://{subdomain}.{site}', {
        site: config.site,
        subdomain: 'api',
      });
      expect(createConfigurationMock).toBeCalledWith({
        baseServer: serverConfigurationMock,
        authMethods: {
          apiKeyAuth: config.apiKey,
          appKeyAuth: config.appKey,
        },
      });

      expect((v1 as any).MonitorsApi).toBeCalledWith(configurationMockReturn);
      expect((observer as any).apiInstance).toEqual(MonitorApiMock);
    });

    it('shoulds return NA status if request return diferent value than 200', async () => {
      getMonitorMock.mockRejectedValue('kaboom');
      const result = await observer.getState();
      expect(result).toEqual({
        name: config.alias,
        status: Status.NA,
        link: expectLink,
      });
    });

    it('shoulds return NA status if response overall_state is Unknown', async () => {
      getMonitorMock.mockResolvedValue({
        overallState: 'Unknown',
      });
      const result = await observer.getState();
      expect(result).toEqual({
        name: config.alias,
        status: Status.NA,
        link: expectLink,
      });
    });

    it('shoulds return FAILURE status if response overall_state is Alert', async () => {
      getMonitorMock.mockResolvedValue({
        overallState: 'Alert',
      });
      const result = await observer.getState();
      expect(result).toEqual({
        name: config.alias,
        status: Status.FAILURE,
        link: expectLink,
      });
    });

    it('shoulds return FAILURE status if response overall_state is Warn', async () => {
      getMonitorMock.mockResolvedValue({
        overallState: 'Warn',
      });
      const result = await observer.getState();
      expect(result).toEqual({
        name: config.alias,
        status: Status.FAILURE,
        link: expectLink,
      });
    });

    it('shoulds return NA status if response overall_state is No Data', async () => {
      getMonitorMock.mockResolvedValue({
        overallState: 'No Data',
      });
      const result = await observer.getState();
      expect(result).toEqual({
        name: config.alias,
        status: Status.NA,
        link: expectLink,
      });
    });

    it('shoulds return NA status if response overall_state is Skipped', async () => {
      getMonitorMock.mockResolvedValue({
        overallState: 'Skipped',
      });
      const result = await observer.getState();
      expect(result).toEqual({
        name: config.alias,
        status: Status.NA,
        link: expectLink,
      });
    });

    it('shoulds return SUCCESS status if response overall_state is OK', async () => {
      getMonitorMock.mockResolvedValue({
        overallState: 'OK',
      });
      const result = await observer.getState();
      expect(result).toEqual({
        name: config.alias,
        status: Status.SUCCESS,
        link: expectLink,
      });
    });
  });
});
