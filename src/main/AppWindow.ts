import { BrowserWindow } from 'electron';

export class AppWindow {
  public readonly window: BrowserWindow;

  constructor(url: string) {
    this.window = this.createWindow(url);
  }

  createWindow(url: string): BrowserWindow {
    const window = new BrowserWindow({
      show: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      }
    })
    window.loadURL(url);
    return window;
  }
}