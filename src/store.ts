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
  autostart: {
    type: 'boolean',
    default: true,
  },
  notificationSchedule: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        weekday: { type: 'number' },
        enableTime: {
          type: 'object',
          properties: {
            hour: { type: 'number' },
            minute: { type: 'number' },
          },
        },
        disableTime: {
          type: 'object',
          properties: {
            hour: { type: 'number' },
            minute: { type: 'number' },
          },
        },
      },
    },
    default: [
      { weekday: 0, enableTime: { hour: 0, minute: 0 }, disableTime: { hour: 23, minute: 59 } },
      { weekday: 1, enableTime: { hour: 0, minute: 0 }, disableTime: { hour: 23, minute: 59 } },
      { weekday: 2, enableTime: { hour: 0, minute: 0 }, disableTime: { hour: 23, minute: 59 } },
      { weekday: 3, enableTime: { hour: 0, minute: 0 }, disableTime: { hour: 23, minute: 59 } },
      { weekday: 4, enableTime: { hour: 0, minute: 0 }, disableTime: { hour: 23, minute: 59 } },
      { weekday: 5, enableTime: { hour: 0, minute: 0 }, disableTime: { hour: 23, minute: 59 } },
      { weekday: 6, enableTime: { hour: 0, minute: 0 }, disableTime: { hour: 23, minute: 59 } },
    ],
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
