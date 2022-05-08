import { BrowserWindow, nativeImage } from 'electron';
import { join } from 'path';

export class AppWindow {
  public readonly window: BrowserWindow;
  private readonly IconPath: string = join(__dirname, '..','assets', 'icon.png');

  constructor(url: string, preload: string) {
    this.window = this.createWindow(url, preload);
  }

  createWindow(url: string, preload: string): BrowserWindow {
    const window = new BrowserWindow({
      title: "Barklarm - Configuration",
      icon: nativeImage.createFromPath(this.IconPath),
      show: false,
      webPreferences: {
        preload: preload,
      }
    })
    window.setMenu(null)
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