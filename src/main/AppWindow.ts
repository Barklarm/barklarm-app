import { BrowserWindow } from 'electron';

export class AppWindow {
  public readonly window: BrowserWindow;

  constructor(url: string, preload: string) {
    this.window = this.createWindow(url, preload);
  }

  createWindow(url: string, preload: string): BrowserWindow {
    const window = new BrowserWindow({
      show: false,
      webPreferences: {
        preload: preload,
      }
    })
    window.loadURL(url);
    window.on('minimize',function(event: any){
      event.preventDefault();
      window.hide();
    });
    
    window.on('close', function (event: any) {
      event.preventDefault();
      window.hide();
    });
    return window;
  }
}