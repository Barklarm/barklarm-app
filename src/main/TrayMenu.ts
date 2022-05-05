import { app, Tray, Menu, nativeImage } from 'electron';
import { appManager } from './AppManager';
import { join } from 'path';
import { ObserverManager, State } from './observers/ObserverManager';

export class TrayMenu {
  public readonly tray: Tray;
  public readonly observerManager: ObserverManager;
  private naIconPath: string = join(__dirname, '..','assets', 'na_icon.png');
  private runningIconPath: string = join(__dirname, '..','assets', 'running_icon.png');
  private okIconPath: string = join(__dirname, '..','assets', 'ok_icon.png');
  private FailIconPath: string = join(__dirname, '..','assets', 'fail_icon.png');


  constructor(observerManager: ObserverManager) {
    this.tray = new Tray(this.createNativeImage());
    this.tray.setContextMenu(this.createMenu());
    this.observerManager = observerManager;
    this.refreshImage()
    setInterval(this.refreshImage.bind(this), 60000);
  }

  async refreshImage(){
    const aggregatedState: State = await this.observerManager.getAggregatedState()
    let iconPath = this.okIconPath;
    if(!aggregatedState.isReachable)
      iconPath = this.naIconPath
    else if(aggregatedState.isRunning)
      iconPath = this.runningIconPath
    else if(!aggregatedState.isSuccess)
      iconPath = this.FailIconPath
    const image = nativeImage.createFromPath(iconPath);
    image.setTemplateImage(true);
    this.tray.setImage(image)
  }

  createNativeImage() {
    const image = nativeImage.createFromPath(this.naIconPath);
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