import { GithubAction } from './GithubAction';
import { Status } from '../../types/Status';
import { ObserverManager } from './ObserverManager';
import { TrayMenu } from '../TrayMenu';
import { NotificationManager } from '../NotificationManager';
import { State } from '../../types/State';

const storeGetMock = jest.fn();

jest.mock('../../store', () => ({
  store: {
    get: (...params: any[]) => storeGetMock(...params),
  },
}));

describe('ObserverManager', () => {
  let observerManager: ObserverManager;
  const trayMock: TrayMenu = {
    updateTrayImage: jest.fn(),
    updateObserverMenu: jest.fn(),
  } as any;
  const notificationManagerMock: NotificationManager = {
    updateNotifications: jest.fn(),
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
      observerManager.refreshState = jest.fn();
    });

    it('should map empty observer if nothing in store', () => {
      storeGetMock.mockReturnValue([{}]);
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

    it('should not map unknown observer types in store', () => {
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
