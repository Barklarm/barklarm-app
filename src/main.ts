import { app, ipcMain } from 'electron';
import { appManager } from './main/AppManager';
import { TrayMenu } from './main/TrayMenu';
import { AppWindow } from './main/AppWindow';
import { ObserverManager } from './main/ObserverManager';
import { NotificationManager } from './main/NotificationManager';
import { dirname, resolve, basename, join } from 'path';
import updateElectronApp from 'update-electron-app';
import hasSquirrelStartupEvents from 'electron-squirrel-startup';
import { store } from './store';
import { initialize } from './i18n';

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const MAIN_WINDOW_VITE_NAME: string;

if (store.get('autoupdate')) {
  updateElectronApp();
}

if (store.get('sslDisabled')) {
  global.process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
} else {
  global.process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1';
}

if (hasSquirrelStartupEvents) {
  app.quit();
}

let updateExePath;
const appFolder = dirname(process.execPath);
const exeName = basename(process.execPath);
if (process.platform === 'win32') {
  app.setAppUserModelId(app.name);
  updateExePath = resolve(appFolder, '..', 'Update.exe');
}

app.setLoginItemSettings({
  openAtLogin: store.get('autostart') as boolean,
  path: updateExePath,
  args: ['--processStart', `"${exeName}"`, '--process-start-args', `"--hidden"`],
});

app.on('ready', () => {
  initialize(app.getLocale()?.slice(0, 2) || 'en');
  const tray = new TrayMenu(store.get('issueGlobalEndpoint') as string);
  const notification = new NotificationManager();

  const observerManager = new ObserverManager(tray, notification, true, store.get('refreshInterval') as number);
  observerManager.refershObservers();
  appManager.setTray(tray);

  appManager.setWindow(
    new AppWindow(MAIN_WINDOW_VITE_DEV_SERVER_URL, MAIN_WINDOW_VITE_NAME, join(__dirname, 'preload.js'))
  );
  ipcMain.on('electron-refresh-observers', () => {
    observerManager.refershObservers();
  });
});
