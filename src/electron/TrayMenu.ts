import { app, Tray, Menu, nativeImage } from 'electron';
import { appManager } from './AppManager';

export class TrayMenu {
  public readonly tray: Tray;
  private iconPath: string = '/assets/try_icon.png';


  constructor() {
    this.tray = new Tray(this.createNativeImage());
    this.tray.setContextMenu(this.createMenu());
  }

  createNativeImage() {
    const path = `${app.getAppPath()}${this.iconPath}`;
    console.log(path);
    const image = nativeImage.createFromPath(path);
    image.setTemplateImage(true);
    return image;
  }

  createMenu(): Menu {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Tokei',
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