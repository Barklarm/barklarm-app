import { faker } from '@faker-js/faker';
import { ipcRenderer, contextBridge } from 'electron';
import { _ } from './preload';

jest.mock('electron', () => ({
  ipcRenderer: {
    sendSync: jest.fn(),
    send: jest.fn(),
  },
  contextBridge: {
    exposeInMainWorld: jest.fn(),
  },
}));

describe('preload', () => {
  const value = { some: faker.datatype.uuid() };
  const sendSyncMock = ipcRenderer.sendSync as jest.Mock<any>;
  const sendMock = ipcRenderer.send as jest.Mock<any>;
  const exposeInMainWorldMock = contextBridge.exposeInMainWorld as jest.Mock<any>;

  beforeEach(() => {
    sendSyncMock.mockReset();
    sendMock.mockReset();
    sendSyncMock.mockReturnValue(value);
  });
  describe('store.get', () => {
    it('should get from store', () => {
      const result = _.store.get('electron-store-get');
      expect(result).toEqual(value);
    });
  });
  describe('store.set', () => {
    it('should get from store', () => {
      const property = faker.datatype.uuid();
      _.store.set(property, value);
      expect(sendMock).toBeCalledWith('electron-store-set', property, value);
    });
  });
  describe('app.refreshObservers', () => {
    it('should get from store', () => {
      _.app.refreshObservers();
      expect(sendMock).toBeCalledWith('electron-refresh-observers');
    });
  });

  it('should call exposeInMainWorld with the electron export', () => {
    expect(exposeInMainWorldMock).toBeCalledWith('electron', _);
  });
});
