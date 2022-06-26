import { CCTray } from './CCTray';
import { faker } from '@faker-js/faker';
import { Status } from '../../types/Status';
import { CCTrayConfiguration } from '../../types/CCTrayConfiguration';

const fetchtMock = jest.fn();
jest.mock('electron-fetch', () => {
  return {
    __esModule: true,
    default: (...all: any) => fetchtMock(...all),
  };
});

describe('CCTray', () => {
  describe('getState', () => {
    let config: CCTrayConfiguration;
    let observer: CCTray;

    beforeEach(() => {
      fetchtMock.mockClear();
      config = {
        type: 'ccTray',
        url: faker.internet.url(),
        alias: faker.random.word(),
      };
      observer = new CCTray(config);
    });

    it('shoulds return NA status if request return diferent value than 200', async () => {
      fetchtMock.mockResolvedValue({
        text: () => Promise.resolve('kaboom'),
        ok: false,
      });
      const result = await observer.getState();
      expect(fetchtMock).toBeCalledWith(config.url, {
        method: 'GET',
      });
      expect(result).toEqual({
        name: config.alias,
        status: Status.NA,
      });
    });

    it('shoulds return NA status if request return xml with last build status unkown and activity equal to Sleeping', async () => {
      const expectedResponseText = ` <Projects>
            <Project
                name="SvnTest"
                activity="Sleeping"
                lastBuildStatus="Unknown"
                lastBuildLabel="8"
                lastBuildTime="2005-09-28T10:30:34.6362160+01:00"
                nextBuildTime="2005-10-04T14:31:52.4509248+01:00"
                webUrl="http://mrtickle/ccnet/"/>
        </Projects>`;
      fetchtMock.mockResolvedValue({
        text: () => Promise.resolve(expectedResponseText),
        ok: true,
      });
      const result = await observer.getState();
      expect(fetchtMock).toBeCalledWith(config.url, {
        method: 'GET',
      });
      expect(result).toEqual({
        name: config.alias,
        status: Status.NA,
      });
    });

    it('shoulds return CHECKING status if request return xml with activity equal to Building', async () => {
      const expectedResponseText = ` <Projects>
            <Project
                name="SvnTest"
                activity="Building"
                lastBuildStatus="Unknown"
                lastBuildLabel="8"
                lastBuildTime="2005-09-28T10:30:34.6362160+01:00"
                nextBuildTime="2005-10-04T14:31:52.4509248+01:00"
                webUrl="http://mrtickle/ccnet/"/>
        </Projects>`;
      fetchtMock.mockResolvedValue({
        text: () => Promise.resolve(expectedResponseText),
        ok: true,
      });
      const result = await observer.getState();
      expect(fetchtMock).toBeCalledWith(config.url, {
        method: 'GET',
      });
      expect(result).toEqual({
        name: config.alias,
        status: Status.CHECKING,
      });
    });

    it('shoulds return CHECKING status if request return xml with activity equal to CheckingModifications', async () => {
      const expectedResponseText = ` <Projects>
            <Project
                name="SvnTest"
                activity="CheckingModifications"
                lastBuildStatus="Unknown"
                lastBuildLabel="8"
                lastBuildTime="2005-09-28T10:30:34.6362160+01:00"
                nextBuildTime="2005-10-04T14:31:52.4509248+01:00"
                webUrl="http://mrtickle/ccnet/"/>
        </Projects>`;
      fetchtMock.mockResolvedValue({
        text: () => Promise.resolve(expectedResponseText),
        ok: true,
      });
      const result = await observer.getState();
      expect(fetchtMock).toBeCalledWith(config.url, {
        method: 'GET',
      });
      expect(result).toEqual({
        name: config.alias,
        status: Status.CHECKING,
      });
    });

    it('shoulds return SUCCESS status if request return xml with last build status Success and activity equal to Sleeping', async () => {
      const expectedResponseText = ` <Projects>
            <Project
                name="SvnTest"
                activity="Sleeping"
                lastBuildStatus="Success"
                lastBuildLabel="8"
                lastBuildTime="2005-09-28T10:30:34.6362160+01:00"
                nextBuildTime="2005-10-04T14:31:52.4509248+01:00"
                webUrl="http://mrtickle/ccnet/"/>
        </Projects>`;
      fetchtMock.mockResolvedValue({
        text: () => Promise.resolve(expectedResponseText),
        ok: true,
      });
      const result = await observer.getState();
      expect(fetchtMock).toBeCalledWith(config.url, {
        method: 'GET',
      });
      expect(result).toEqual({
        name: config.alias,
        status: Status.SUCCESS,
      });
    });
    it('shoulds return Failure status if request return xml with last build status Failure and activity equal to Sleeping', async () => {
      const expectedResponseText = ` <Projects>
            <Project
                name="SvnTest"
                activity="Sleeping"
                lastBuildStatus="Failure"
                lastBuildLabel="8"
                lastBuildTime="2005-09-28T10:30:34.6362160+01:00"
                nextBuildTime="2005-10-04T14:31:52.4509248+01:00"
                webUrl="http://mrtickle/ccnet/"/>
        </Projects>`;
      fetchtMock.mockResolvedValue({
        text: () => Promise.resolve(expectedResponseText),
        ok: true,
      });
      const result = await observer.getState();
      expect(fetchtMock).toBeCalledWith(config.url, {
        method: 'GET',
      });
      expect(result).toEqual({
        name: config.alias,
        status: Status.FAILURE,
      });
    });
    it('shoulds return Failure status if request return xml with last build status Exception and activity equal to Sleeping', async () => {
      const expectedResponseText = ` <Projects>
            <Project
                name="SvnTest"
                activity="Sleeping"
                lastBuildStatus="Exception"
                lastBuildLabel="8"
                lastBuildTime="2005-09-28T10:30:34.6362160+01:00"
                nextBuildTime="2005-10-04T14:31:52.4509248+01:00"
                webUrl="http://mrtickle/ccnet/"/>
        </Projects>`;
      fetchtMock.mockResolvedValue({
        text: () => Promise.resolve(expectedResponseText),
        ok: true,
      });
      const result = await observer.getState();
      expect(fetchtMock).toBeCalledWith(config.url, {
        method: 'GET',
      });
      expect(result).toEqual({
        name: config.alias,
        status: Status.FAILURE,
      });
    });
  });
});
