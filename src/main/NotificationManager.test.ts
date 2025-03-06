import { NotificationManager } from './NotificationManager';
import { faker } from '@faker-js/faker';
import { State } from '../types/State';
import { Status } from '../types/Status';
import { Notification } from 'electron';
import { expect, describe, it, vi, beforeEach } from 'vitest';

vi.mock('../i18n', () => ({
  translate: (val: string): string => val,
}));

vi.mock('electron', () => ({
  nativeImage: {
    createFromPath: vi.fn(),
  },
  Notification: vi.fn(),
}));

describe.skip('NotificationManager', () => {
  const NotificationMock = Notification as any;
  const notificationManager: NotificationManager = new NotificationManager();
  beforeEach(() => {
    NotificationMock.mockClear();
  });
  describe('updateNotifications', () => {
    it('shoulds not raise a notification with same name and sam status', async () => {
      const expectedName = faker.lorem.word();
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
      const expectedName = faker.lorem.word();
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
        body: `${expectedName} Succeeded`,
        icon: undefined,
        title: 'Succeeded',
      });
    });
    it('shoulds raise a notification with same name and diferent status towards FAILURE', async () => {
      NotificationMock.mockReturnValue([]);
      const expectedName = faker.lorem.word();
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
        title: 'Failed',
      });
    });
    it('shoulds raise a notification with same name and diferent status towards CHECKING', async () => {
      NotificationMock.mockReturnValue([]);
      const expectedName = faker.lorem.word();
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
      const expectedName = faker.lorem.word();
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
