import { NotificationManager } from './NotificationManager';
import { faker } from '@faker-js/faker';
import { State } from '../types/State';
import { Status } from '../types/Status';
import { Notification } from 'electron';

jest.mock('electron', () => ({
  nativeImage: {
    createFromPath: jest.fn(),
  },
  Notification: jest.fn(),
}));

describe('NotificationManager', () => {
  const NotificationMock = Notification as any;
  const notificationManager: NotificationManager = new NotificationManager();
  beforeEach(() => {
    NotificationMock.mockClear();
  });
  describe('updateNotifications', () => {
    it('shoulds not raise a notification with same name and sam status', async () => {
      const expectedName = faker.random.word();
      const oldState: State[] = [
        {
          name: expectedName,
          status: Status.NA,
          link: faker.internet.url(),
        },
      ];
      const newState: State[] = [
        {
          name: expectedName,
          status: Status.NA,
          link: faker.internet.url(),
        },
      ];
      notificationManager.updateNotifications(oldState, newState);
      expect(NotificationMock).not.toBeCalled();
    });
    it('shoulds raise a notification with same name and diferent status towards SUCCESS', async () => {
      NotificationMock.mockReturnValue([]);
      const expectedName = faker.random.word();
      const oldState: State[] = [
        {
          name: expectedName,
          status: Status.NA,
          link: faker.internet.url(),
        },
      ];
      const newState: State[] = [
        {
          name: expectedName,
          status: Status.SUCCESS,
          link: faker.internet.url(),
        },
      ];
      notificationManager.updateNotifications(oldState, newState);
      expect(NotificationMock).toBeCalledWith({
        body: `${expectedName} Success`,
        icon: undefined,
        title: 'Success',
      });
    });
    it('shoulds raise a notification with same name and diferent status towards FAILURE', async () => {
      NotificationMock.mockReturnValue([]);
      const expectedName = faker.random.word();
      const oldState: State[] = [
        {
          name: expectedName,
          status: Status.NA,
          link: faker.internet.url(),
        },
      ];
      const newState: State[] = [
        {
          name: expectedName,
          status: Status.FAILURE,
          link: faker.internet.url(),
        },
      ];
      notificationManager.updateNotifications(oldState, newState);
      expect(NotificationMock).toBeCalledWith({
        body: `${expectedName} Failed`,
        icon: undefined,
        title: 'Fail',
      });
    });
    it('shoulds raise a notification with same name and diferent status towards CHECKING', async () => {
      NotificationMock.mockReturnValue([]);
      const expectedName = faker.random.word();
      const oldState: State[] = [
        {
          name: expectedName,
          status: Status.NA,
          link: faker.internet.url(),
        },
      ];
      const newState: State[] = [
        {
          name: expectedName,
          status: Status.CHECKING,
          link: faker.internet.url(),
        },
      ];
      notificationManager.updateNotifications(oldState, newState);
      expect(NotificationMock).toBeCalledWith({
        body: `${expectedName} Checking`,
        icon: undefined,
        title: 'Checking',
      });
    });
    it('shoulds raise a notification with same name and diferent status towards NA', async () => {
      NotificationMock.mockReturnValue([]);
      const expectedName = faker.random.word();
      const oldState: State[] = [
        {
          name: expectedName,
          status: Status.SUCCESS,
          link: faker.internet.url(),
        },
      ];
      const newState: State[] = [
        {
          name: expectedName,
          status: Status.NA,
          link: faker.internet.url(),
        },
      ];
      notificationManager.updateNotifications(oldState, newState);
      expect(NotificationMock).toBeCalledWith({
        body: `${expectedName} Unaccesible`,
        icon: undefined,
        title: 'Unaccesible',
      });
    });
  });
});
