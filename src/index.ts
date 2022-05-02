import { app } from 'electron';
import { appManager } from './main/AppManager';
import { TrayMenu } from './main/TrayMenu';
import { AppWindow } from './main/AppWindow';
import "./store";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

app.on('ready', () => {
  appManager.setTray(new TrayMenu());
  appManager.setWindow('AppWindow', new AppWindow(MAIN_WINDOW_WEBPACK_ENTRY, MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY));
});