import { app, Tray, Menu, nativeImage, MenuItemConstructorOptions, shell } from 'electron';
import { appManager } from './AppManager';
import { State } from '../types/State';
import { Status } from '../types/Status';
import { MapType } from '../types/MapType';
import { translate } from '../i18n';

import okIcon from '../assets/ok_icon.png';
import failIcon from '../assets/fail_icon.png';
import runningIcon from '../assets/running_icon.png';
import naIcon from '../assets/na_icon.png';

export class TrayMenu {
  public readonly tray: Tray;

  public readonly defaultMenuItems: MenuItemConstructorOptions[] = [
    {
      label: translate('Configure'),
      type: 'normal',
      click: () => {
        appManager.getWindow().window.show();
      },
    },
    {
      label: translate('Quit'),
      type: 'normal',
      click: () => {
        appManager.getWindow().window.destroy();
        app.quit();
      },
    },
  ];

  public readonly statusToImagePathMap: MapType<string> = {
    [Status.SUCCESS]: okIcon,
    [Status.FAILURE]: failIcon,
    [Status.CHECKING]: runningIcon,
    [Status.NA]: naIcon,
  };

  constructor() {
    this.tray = new Tray(this.createNativeImage());
    this.tray.setContextMenu(this.createMenu());
  }

  public updateTrayImage(state: State) {
    const image = nativeImage.createFromDataURL(this.getIconForState(state));
    this.tray.setImage(image);
  }

  public updateObserverMenu(observersState: State[]) {
    const observersStateMenuItems: MenuItemConstructorOptions[] = observersState.map((observerState) => {
      return {
        label: observerState.name,
        submenu: [{ label: translate('Link'), click: () => shell.openExternal(observerState.link) }],
        icon: nativeImage.createFromDataURL(this.getIconForState(observerState)),
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
    const image = nativeImage.createFromDataURL(this.statusToImagePathMap[Status.NA]);
    return image;
  }

  private createMenu(): Menu {
    const contextMenu = Menu.buildFromTemplate(this.defaultMenuItems);
    return contextMenu;
  }
}
