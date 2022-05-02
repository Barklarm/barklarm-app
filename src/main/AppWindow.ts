import { BrowserWindow } from 'electron';
import { join } from 'path';

export class AppWindow {
  public readonly window: BrowserWindow;

  constructor(url: string, preload: string) {
    this.window = this.createWindow(url, preload);
  }

  createWindow(url: string, preload: string): BrowserWindow {
    const window = new BrowserWindow({
      show: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: preload,
      }
    })
    window.loadURL(url);
    window.webContents.openDevTools();
    return window;
  }
}