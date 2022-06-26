import Store from 'electron-store';
import { ipcMain } from 'electron';

export const store = new Store();

ipcMain.on('electron-store-get', async (event: any, val: any) => {
  event.returnValue = store.get(val);
});

ipcMain.on('electron-store-set', async (event: any, key: any, val: any) => {
  store.set(key, val);
});
