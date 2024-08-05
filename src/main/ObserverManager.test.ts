import { Status } from '../types/Status';
import { ObserverManager } from './ObserverManager';
import { TrayMenu } from './TrayMenu';
import { NotificationManager } from './NotificationManager';
import { State } from '../types/State';
import { GithubAction } from '../extensions/github/observer';
import { CCTray } from '../extensions/cctray/observer';
import { Sentry } from '../extensions/sentry/observer';
import { DatadogMonitor } from '../extensions/datadog/observer';
import { NewRelic } from '../extensions/newRelic/observer';
import { expect, describe, it, vi, beforeEach } from 'vitest';

const storeGetMock = vi.fn();

vi.mock('../store', () => ({
  store: {
    get: (...params: any[]) => storeGetMock(...params),
  },
}));

describe('ObserverManager', () => {
  let observerManager: ObserverManager;
  const trayMock: TrayMenu = {
    updateTrayImage: vi.fn(),
    updateObserverMenu: vi.fn(),
  } as any;
  const notificationManagerMock: NotificationManager = {
    updateNotifications: vi.fn(),
  } as any;

  beforeEach(() => {
    storeGetMock.mockClear();
    (trayMock.updateTrayImage as any).mockClear();
    (trayMock.updateObserverMenu as any).mockClear();
    (notificationManagerMock.updateNotifications as any).mockClear();
    observerManager = new ObserverManager(trayMock, notificationManagerMock, false);
  });
  describe('refershObservers', () => {
    beforeEach(() => {
      observerManager.refreshState = vi.fn();
    });

    it('should map empty observer if nothing in store', () => {
      storeGetMock.mockReturnValue([]);
      observerManager.refershObservers();
      expect(storeGetMock).toBeCalledWith('observables');
      expect(observerManager.refreshState).toBeCalled();
      expect((observerManager as any).observers).toEqual([]);
    });

    it('should map githubAction observer if in store', () => {
      storeGetMock.mockReturnValue([
        {
          type: 'githubAction',
        },
      ]);
      observerManager.refershObservers();
      expect(storeGetMock).toBeCalledWith('observables');
      expect(observerManager.refreshState).toBeCalled();
      expect((observerManager as any).observers[0]).toBeInstanceOf(GithubAction);
    });

    it('should map cctray observer if in store', () => {
      storeGetMock.mockReturnValue([
        {
          type: 'ccTray',
        },
      ]);
      observerManager.refershObservers();
      expect(storeGetMock).toBeCalledWith('observables');
      expect(observerManager.refreshState).toBeCalled();
      expect((observerManager as any).observers[0]).toBeInstanceOf(CCTray);
    });

    it('should map datadogMonitor observer if in store', () => {
      storeGetMock.mockReturnValue([
        {
          type: 'datadogMonitor',
        },
      ]);
      observerManager.refershObservers();
      expect(storeGetMock).toBeCalledWith('observables');
      expect(observerManager.refreshState).toBeCalled();
      expect((observerManager as any).observers[0]).toBeInstanceOf(DatadogMonitor);
    });

    it('should map sentry observer if in store', () => {
      storeGetMock.mockReturnValue([
        {
          type: 'sentry',
        },
      ]);
      observerManager.refershObservers();
      expect(storeGetMock).toBeCalledWith('observables');
      expect(observerManager.refreshState).toBeCalled();
      expect((observerManager as any).observers[0]).toBeInstanceOf(Sentry);
    });

    it('should map newRelic observer if in store', () => {
      storeGetMock.mockReturnValue([
        {
          type: 'newRelic',
        },
      ]);
      observerManager.refershObservers();
      expect(storeGetMock).toBeCalledWith('observables');
      expect(observerManager.refreshState).toBeCalled();
      expect((observerManager as any).observers[0]).toBeInstanceOf(NewRelic);
    });

    it('should not map unknown observer types in store', () => {
      storeGetMock.mockReturnValue([
        {
          type: 'someRandom',
        },
      ]);
      observerManager.refershObservers();
      expect(storeGetMock).toBeCalledWith('observables');
      expect(observerManager.refreshState).toBeCalled();
      expect((observerManager as any).observers[0]).toBeUndefined();
    });
  });

  describe('refreshState', () => {
    it('should return SUCCESS status if all observers return success', async () => {
      const observers = [
        {
          getState: () =>
            Promise.resolve({
              name: 'awesome',
              status: Status.SUCCESS,
              link: '',
            }),
        },
        {
          getState: () =>
            Promise.resolve({
              name: 'awesome2',
              status: Status.SUCCESS,
              link: '',
            }),
        },
      ];
      (observerManager as any).observers = observers;
      const expectedObserversState: State[] = await Promise.all([observers[0].getState(), observers[1].getState()]);
      const expectedGlobalState: State = {
        name: 'Global',
        status: Status.SUCCESS,
        link: '',
      };
      await observerManager.refreshState();
      expect(notificationManagerMock.updateNotifications).toBeCalledWith([], expectedObserversState);
      expect(trayMock.updateTrayImage).toBeCalledWith(expectedGlobalState);
      expect(trayMock.updateObserverMenu).toBeCalledWith(expect.objectContaining(expectedObserversState));
    });
    it('should return FAILURE status if any observers return failure', async () => {
      const observers = [
        {
          getState: () =>
            Promise.resolve({
              name: 'awesome',
              status: Status.SUCCESS,
              link: '',
            }),
        },
        {
          getState: () =>
            Promise.resolve({
              name: 'awesome',
              status: Status.NA,
              link: '',
            }),
        },
        {
          getState: () =>
            Promise.resolve({
              name: 'awesome2',
              status: Status.FAILURE,
              link: '',
            }),
        },
      ];
      (observerManager as any).observers = observers;
      const expectedObserversState: State[] = await Promise.all([
        observers[0].getState(),
        observers[1].getState(),
        observers[2].getState(),
      ]);
      const expectedGlobalState: State = {
        name: 'Global',
        status: Status.FAILURE,
        link: '',
      };
      await observerManager.refreshState();
      expect(notificationManagerMock.updateNotifications).toBeCalledWith([], expectedObserversState);
      expect(trayMock.updateTrayImage).toBeCalledWith(expectedGlobalState);
      expect(trayMock.updateObserverMenu).toBeCalledWith(expectedObserversState);
    });
    it('should return NA status if any observers return NA', async () => {
      const observers = [
        {
          getState: () =>
            Promise.resolve({
              name: 'awesome',
              status: Status.SUCCESS,
              link: '',
            }),
        },
        {
          getState: () =>
            Promise.resolve({
              name: 'awesome',
              status: Status.CHECKING,
              link: '',
            }),
        },
        {
          getState: () =>
            Promise.resolve({
              name: 'awesome2',
              status: Status.NA,
              link: '',
            }),
        },
      ];
      (observerManager as any).observers = observers;
      const expectedObserversState: State[] = await Promise.all([
        observers[0].getState(),
        observers[1].getState(),
        observers[2].getState(),
      ]);
      const expectedGlobalState: State = {
        name: 'Global',
        status: Status.NA,
        link: '',
      };
      await observerManager.refreshState();
      expect(notificationManagerMock.updateNotifications).toBeCalledWith([], expectedObserversState);
      expect(trayMock.updateTrayImage).toBeCalledWith(expectedGlobalState);
      expect(trayMock.updateObserverMenu).toBeCalledWith(expectedObserversState);
    });
    it('should return CHEKING status if any observers return CHEKING', async () => {
      const observers = [
        {
          getState: () =>
            Promise.resolve({
              name: 'awesome',
              status: Status.SUCCESS,
              link: '',
            }),
        },
        {
          getState: () =>
            Promise.resolve({
              name: 'awesome2',
              status: Status.CHECKING,
              link: '',
            }),
        },
      ];
      (observerManager as any).observers = observers;
      const expectedObserversState: State[] = await Promise.all([observers[0].getState(), observers[1].getState()]);
      const expectedGlobalState: State = {
        name: 'Global',
        status: Status.CHECKING,
        link: '',
      };
      await observerManager.refreshState();
      expect(notificationManagerMock.updateNotifications).toBeCalledWith([], expectedObserversState);
      expect(trayMock.updateTrayImage).toBeCalledWith(expectedGlobalState);
      expect(trayMock.updateObserverMenu).toBeCalledWith(expectedObserversState);
    });
  });
});
