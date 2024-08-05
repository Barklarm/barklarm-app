import { faker } from '@faker-js/faker';
import { ipcRenderer, contextBridge } from 'electron';
import { _ } from './preload';
import { expect, describe, it, vi, beforeEach, Mock } from 'vitest';

vi.mock('electron', () => ({
  ipcRenderer: {
    sendSync: vi.fn(),
    send: vi.fn(),
  },
  contextBridge: {
    exposeInMainWorld: vi.fn(),
  },
}));

describe('preload', () => {
  const value = { some: faker.string.uuid() };
  const sendSyncMock = ipcRenderer.sendSync as Mock<any>;
  const sendMock = ipcRenderer.send as Mock<any>;
  const exposeInMainWorldMock = contextBridge.exposeInMainWorld as Mock<any>;

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
      const property = faker.string.uuid();
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
