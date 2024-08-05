import { faker } from '@faker-js/faker';
import { storage } from './storage';
import { expect, describe, it, vi, beforeEach } from 'vitest';

describe('storage', () => {
  const electronMock = {
    store: {
      set: vi.fn(),
      get: vi.fn(),
    },
    app: {
      refreshObservers: vi.fn(),
    },
  };
  let storageFunctions: any;

  beforeEach(() => {
    electronMock.store.get.mockReset();
    electronMock.store.set.mockReset();
    electronMock.app.refreshObservers.mockReset();
    storageFunctions = storage(electronMock);
  });
  describe('saveObservers', () => {
    it('should set observers and refresh', () => {
      const newObservable = { some: faker.string.uuid() };
      storageFunctions.saveObservers(newObservable);
      expect(electronMock.store.set).toBeCalledWith('observables', newObservable);
      expect(electronMock.app.refreshObservers).toBeCalled();
    });
  });
  describe('getObservers', () => {
    it('should retrieve the list of observables', () => {
      const observables = { some: faker.string.uuid() };
      electronMock.store.get.mockReturnValue(observables);
      const result = storageFunctions.getObservers();
      expect(electronMock.store.get).toBeCalledWith('observables');
      expect(result).toEqual(observables);
    });
    it('should retrieve empty list if observables is empty', () => {
      electronMock.store.get.mockReturnValue(undefined);
      const result = storageFunctions.getObservers();
      expect(electronMock.store.get).toBeCalledWith('observables');
      expect(result).toEqual([]);
    });
  });
});
