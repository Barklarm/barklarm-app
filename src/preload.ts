import { contextBridge, ipcRenderer } from 'electron';

export const _ = {
  store: {
    get: (val: any) => ipcRenderer.sendSync('electron-store-get', val),
    set: (property: any, val: any) => ipcRenderer.send('electron-store-set', property, val),
    import: (): boolean => ipcRenderer.sendSync('electron-store-import'),
    export: (): boolean => ipcRenderer.sendSync('electron-store-export'),
  },
  app: {
    refreshObservers: () => ipcRenderer.send('electron-refresh-observers'),
  },
};
contextBridge.exposeInMainWorld('electron', _);
