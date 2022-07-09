import { ManagerTypes } from '../types/ManagerTypes';
import { TrayMenu } from './TrayMenu';

class AppManager {
  private trayMenu!: TrayMenu;
  private window: ManagerTypes;

  setTray(tray: TrayMenu): void {
    this.trayMenu = tray;
  }

  getTray(): TrayMenu {
    return this.trayMenu;
  }

  setWindow(element: ManagerTypes): void {
    this.window = element;
  }

  getWindow(): ManagerTypes {
    return this.window;
  }
}

export const appManager = new AppManager();
