import { app, Tray, Menu, nativeImage, MenuItemConstructorOptions } from 'electron';
import { appManager } from './AppManager';
import { join } from 'path';
import { State } from '../types/State';
import { Status } from '../types/Status';
import { MapType } from '../types/MapType';

export class TrayMenu {
  public readonly tray: Tray;
  private readonly defaultMenuItems: MenuItemConstructorOptions[] = [
    {
      label: 'Configure',
      type: 'normal',
      click: () => {
        appManager.getWindow('AppWindow').window.show();
      },
    },
    {
      label: 'Quit',
      type: 'normal',
      click: () => {
        appManager.getWindow('AppWindow').window.destroy();
        app.quit();
      },
    },
  ];
  private readonly statusToImagePathMap: MapType<string> = {
    [Status.SUCCESS]: join(__dirname, '..', 'assets', 'ok_icon.png'),
    [Status.FAILURE]: join(__dirname, '..', 'assets', 'fail_icon.png'),
    [Status.CHECKING]: join(__dirname, '..', 'assets', 'running_icon.png'),
    [Status.NA]: join(__dirname, '..', 'assets', 'na_icon.png'),
  };

  constructor() {
    this.tray = new Tray(this.createNativeImage());
    this.tray.setContextMenu(this.createMenu());
  }

  public updateTrayImage(state: State) {
    const image = nativeImage.createFromPath(this.getIconForState(state));
    image.setTemplateImage(true);
    this.tray.setImage(image);
  }

  public updateObserverMenu(observersState: State[]) {
    const observersStateMenuItems: MenuItemConstructorOptions[] = observersState.map((observerState) => {
      return {
        label: observerState.name,
        type: 'normal',
        icon: nativeImage.createFromPath(this.getIconForState(observerState)),
      };
    });
    this.tray.setContextMenu(
      Menu.buildFromTemplate([...observersStateMenuItems, { type: 'separator' }, ...this.defaultMenuItems])
    );
  }

  private getIconForState(state: State) {
    return this.statusToImagePathMap[state.status];
  }

  private createNativeImage() {
    const image = nativeImage.createFromPath(this.statusToImagePathMap[Status.NA]);
    image.setTemplateImage(true);
    return image;
  }

  private createMenu(): Menu {
    const contextMenu = Menu.buildFromTemplate(this.defaultMenuItems);
    return contextMenu;
  }
}
