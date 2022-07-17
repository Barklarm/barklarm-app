import { faker } from '@faker-js/faker';
import { ipcMain } from 'electron';
import { _ } from './store';

const expectedResult = { some: faker.datatype.uuid() };
jest.mock('electron-store', () => {
  return jest.fn().mockImplementation(() => {
    return {
      get: () => expectedResult,
      set: () => true,
    };
  });
});

jest.mock('electron', () => {
  return {
    ipcMain: {
      on: jest.fn(),
    },
  };
});

describe('preload', () => {
  const value = { some: faker.datatype.uuid() };
  const ipcMainOnMock = ipcMain.on as jest.Mock<any>;

  describe('storeGet', () => {
    it('should call ipcmain on with Get functionality', () => {
      expect(ipcMainOnMock).toBeCalledWith('electron-store-get', _.storeGet);
    });
    it('should get from store', () => {
      const event: any = {};
      const expectedValue = faker.datatype.uuid();
      _.storeGet(event, expectedValue);
      expect(event.returnValue).toEqual(expectedResult);
    });
  });
  describe('storeSet', () => {
    it('should call ipcmain on with Set functionality', () => {
      expect(ipcMainOnMock).toBeCalledWith('electron-store-set', _.storeSet);
    });
    it('should set key value in the store', () => {
      const event: any = {};
      const expectedKey = faker.datatype.uuid();
      const expectedValue = faker.datatype.uuid();
      _.storeSet(undefined, expectedKey, expectedValue);
    });
  });
});
