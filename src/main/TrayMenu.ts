import { app, Tray, Menu, nativeImage, MenuItemConstructorOptions, shell, Notification } from 'electron';
import { appManager } from './AppManager';
import { join } from 'path';
import { State } from '../types/State';
import { Status } from '../types/Status';
import { MapType } from '../types/MapType';
import { translate } from '../i18n';
import fetch from 'electron-fetch';

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
    [Status.SUCCESS]: join(__dirname, '..', 'assets', 'ok_icon.png'),
    [Status.FAILURE]: join(__dirname, '..', 'assets', 'fail_icon.png'),
    [Status.CHECKING]: join(__dirname, '..', 'assets', 'running_icon.png'),
    [Status.NA]: join(__dirname, '..', 'assets', 'na_icon.png'),
  };
  private issueGlobalEndpoint: string;

  constructor(issueGlobalEndpoint?: string) {
    this.tray = new Tray(this.createNativeImage());
    this.tray.setContextMenu(this.createMenu());
    this.issueGlobalEndpoint = issueGlobalEndpoint;
  }

  public updateTrayImage(state: State) {
    const image = nativeImage.createFromPath(this.getIconForState(state));
    this.tray.setImage(image);
  }

  public updateObserverMenu(observersState: State[]) {
    const observersStateMenuItems: MenuItemConstructorOptions[] = observersState.map((observerState) => {
      const submenuBase = [{ label: translate('Link'), click: () => shell.openExternal(observerState.link) }];
      const issueEndpoint = observerState.issueEndpoint || this.issueGlobalEndpoint;
      return {
        label: observerState.name,
        submenu:
          observerState.status === Status.FAILURE && issueEndpoint
            ? [
                ...submenuBase,
                {
                  label: translate('Open Issue'),
                  click: async () => {
                    try {
                      const result = await fetch(issueEndpoint, {
                        method: 'POST',
                        body: JSON.stringify(observerState),
                        headers: { 'Content-Type': 'application/json' },
                      });
                      new Notification({
                        title: translate('Issue Open: Success'),
                        body: `${observerState.name} ${translate('Issue Open Succeded')}`,
                        icon: nativeImage.createFromPath(join(__dirname, '..', 'assets', 'ok_icon_big.png')),
                      }).show();
                    } catch (error) {
                      new Notification({
                        title: translate('Issue Open: Failed'),
                        body: `${observerState.name} ${translate('Issue Open Failed')}`,
                        icon: nativeImage.createFromPath(join(__dirname, '..', 'assets', 'fail_icon_big.png')),
                      }).show();
                    }
                  },
                },
              ]
            : submenuBase,
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
    return image;
  }

  private createMenu(): Menu {
    const contextMenu = Menu.buildFromTemplate(this.defaultMenuItems);
    return contextMenu;
  }
}
