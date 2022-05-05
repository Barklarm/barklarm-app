import { app, Tray, Menu, nativeImage } from 'electron';
import { appManager } from './AppManager';
import { join } from 'path';

export class TrayMenu {
  public readonly tray: Tray;
  private iconPath: string = join(__dirname, '..','assets', 'try_icon.png');


  constructor() {
    this.tray = new Tray(this.createNativeImage());
    this.tray.setContextMenu(this.createMenu());
  }

  createNativeImage() {
    const image = nativeImage.createFromPath(this.iconPath);
    image.setTemplateImage(true);
    return image;
  }

  createMenu(): Menu {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Show',
        type: 'normal',
        click: () => { 
          appManager.getWindow('AppWindow').window.show();
        }
      },
      {
        label: 'Quit',
        type: 'normal',
        click: () => app.quit()
      }
    ]);
    return contextMenu;
  }
}