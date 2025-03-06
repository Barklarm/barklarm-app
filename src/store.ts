import Store from 'electron-store';
import { ipcMain, dialog } from 'electron';
import { writeFileSync, readFileSync } from 'fs';

const schema: any = {
  observers: {
    type: 'array',
    items: {
      type: 'number',
    },
  },
  autoupdate: {
    type: 'boolean',
    default: true,
  },
  sslDisabled: {
    type: 'boolean',
    default: false,
  },
  autostart: {
    type: 'boolean',
    default: true,
  },
  refreshInterval: {
    type: 'number',
    default: 60000,
  },
};

export const store = new Store({ schema });

export const _ = {
  storeGet: (event: any, val: any) => {
    event.returnValue = store.get(val);
  },
  storeSet: (_: any, key: any, val: any) => {
    store.set(key, val);
  },
  storeImport: (event: any) => {
    const options = {
      title: 'Import Barklarm Configuration',
      buttonLabel: 'Import',
      filters: [
        { name: 'Configuration', extensions: ['json'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    };
    const filename = dialog.showOpenDialogSync(options);
    if (!filename) {
      event.returnValue = false;
      return;
    }
    store.store = JSON.parse(readFileSync(filename[0], 'utf8'));
    event.returnValue = true;
    return;
  },
  storeExport: (event: any) => {
    const options = {
      title: 'Export Barklarm Configuration',
      buttonLabel: 'Export',
      filters: [
        { name: 'Configuration', extensions: ['json'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    };
    const filename = dialog.showSaveDialogSync(options);
    if (!filename) {
      event.returnValue = false;
      return;
    }
    writeFileSync(filename, JSON.stringify(store.store));
    event.returnValue = true;
    return;
  },
};

ipcMain.on('electron-store-get', _.storeGet);

ipcMain.on('electron-store-set', _.storeSet);

ipcMain.on('electron-store-import', _.storeImport);

ipcMain.on('electron-store-export', _.storeExport);
