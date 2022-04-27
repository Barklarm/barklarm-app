import { app, BrowserWindow } from 'electron';
import isDev from 'electron-is-dev'; // New Import
import { appManager } from '@/electron/AppManager';
import { TrayMenu } from '@/electron/TrayMenu';
import { AppWindow } from '@/electron/AppWindow';

const createWindow = (): void => {
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });
  console.log(isDev);
  win.loadURL(
    isDev
      ? 'http://localhost:9000'
      : `file://${app.getAppPath()}/index.html`,
  );
}

const appElements: any = {
  tray: null,
  windows: []
};

app.on('ready', () => {
  appManager.setTray(new TrayMenu());
  appManager.setWindow('AppWindow', new AppWindow());
});