import { contextBridge, ipcRenderer } from 'electron';

export const _ = {
  store: {
    get: (val: any) => ipcRenderer.sendSync('electron-store-get', val),
    set: (property: any, val: any) => ipcRenderer.sendSync('electron-store-set', property, val),
  },
  app: {
    refreshObservers: () => ipcRenderer.sendSync('electron-refresh-observers'),
  },
};
contextBridge.exposeInMainWorld('electron', _);
