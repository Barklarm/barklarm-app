import { app, Tray, Menu, nativeImage, MenuItemConstructorOptions } from 'electron';
import { appManager } from './AppManager';
import { join } from 'path';
import { State } from "../types/State";

export class TrayMenu {
  public readonly tray: Tray;
  private readonly naIconPath: string = join(__dirname, '..','assets', 'na_icon.png');
  private readonly runningIconPath: string = join(__dirname, '..','assets', 'running_icon.png');
  private readonly okIconPath: string = join(__dirname, '..','assets', 'ok_icon.png');
  private readonly FailIconPath: string = join(__dirname, '..','assets', 'fail_icon.png');
  private readonly defaultMenuItems: MenuItemConstructorOptions[] = [
    {
      label: 'Configure',
      type: 'normal',
      click: () => { 
        appManager.getWindow('AppWindow').window.show();
      }
    },
    {
      label: 'Quit',
      type: 'normal',
      click: () => {
        appManager.getWindow('AppWindow').window.destroy();
        app.quit()
      }
    }
  ]

  constructor() {
    this.tray = new Tray(this.createNativeImage());
    this.tray.setContextMenu(this.createMenu());
  }
  
  public updateTrayImage(state: State){
    const image = nativeImage.createFromPath(this.getIconForState(state));
    image.setTemplateImage(true);
    this.tray.setImage(image)
  }

  public updateObserverMenu(observersState: State[]){
    const observersStateMenuItems: MenuItemConstructorOptions[] = observersState.map(observerState => {
      return {
        label: observerState.name,
        type: 'normal',
        icon:  nativeImage.createFromPath(this.getIconForState(observerState))
      }
    })
    this.tray.setContextMenu(Menu.buildFromTemplate([...observersStateMenuItems, {type: 'separator'}, ...this.defaultMenuItems]));
  }

  private getIconForState(state: State){
      let iconPath = this.okIconPath;
      if(!state.isReachable)
        iconPath = this.naIconPath
      else if(state.isRunning)
        iconPath = this.runningIconPath
      else if(!state.isSuccess)
        iconPath = this.FailIconPath
      return iconPath
  }

  private createNativeImage() {
    const image = nativeImage.createFromPath(this.naIconPath);
    image.setTemplateImage(true);
    return image;
  }

  private createMenu(): Menu {
    const contextMenu = Menu.buildFromTemplate(this.defaultMenuItems);
    return contextMenu;
  }
}