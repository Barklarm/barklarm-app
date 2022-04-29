import { app, BrowserWindow } from 'electron';
import isDev from 'electron-is-dev';
import { store } from './Store';

export class AppWindow {
  public readonly window: BrowserWindow;

  constructor() {
    this.window = this.createWindow();
  }

  createWindow(): BrowserWindow {
    const window = new BrowserWindow({
      show: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      }
    })

    // Load our index.html
    window.loadURL(
      isDev
        ? 'http://localhost:9000'
        : `file://${app.getAppPath()}/index.html`,
    );
    
    return window;
  }
}