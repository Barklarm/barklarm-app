import { app } from 'electron';
import { appManager } from '@/electron/AppManager';
import { TrayMenu } from '@/electron/TrayMenu';
import { AppWindow } from '@/electron/AppWindow';

app.on('ready', () => {
  appManager.setTray(new TrayMenu());
  appManager.setWindow('AppWindow', new AppWindow());
});