import Store from 'electron-store';
import { ipcMain } from 'electron';

export const store = new Store();

export const _ = {
  storeGet: (event: any, val: any) => {
    event.returnValue = store.get(val);
  },
  storeSet: (_: any, key: any, val: any) => {
    store.set(key, val);
  },
};

ipcMain.on('electron-store-get', _.storeGet);

ipcMain.on('electron-store-set', _.storeSet);
