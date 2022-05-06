import { app } from 'electron';
import { appManager } from './main/AppManager';
import { TrayMenu } from './main/TrayMenu';
import { AppWindow } from './main/AppWindow';
import { ObserverManager } from './main/observers/ObserverManager';
import "./store";
import { NotificationManager } from './main/NotificationManager';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

app.on('ready', () => {
  const tray = new TrayMenu()
  const notification = new NotificationManager()
  const observerManager = new ObserverManager(tray, notification)
  observerManager.refershObservers()
  appManager.setTray(tray);
  appManager.setWindow('AppWindow', new AppWindow(MAIN_WINDOW_WEBPACK_ENTRY, MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY));
});