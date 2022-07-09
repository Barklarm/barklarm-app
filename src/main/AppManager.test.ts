import { appManager } from './AppManager';
import { faker } from '@faker-js/faker';
import { ManagerTypes } from '../types/ManagerTypes';
import { TrayMenu } from './TrayMenu';

describe('appManager', () => {
  describe('Tray Management', () => {
    it('shoulds return the same tray that is set', async () => {
      const expecteTray: TrayMenu = jest.fn() as any;
      appManager.setTray(expecteTray);
      expect(appManager.getTray()).toBe(expecteTray);
    });
  });
  describe('Window Management', () => {
    it('shoulds return the same tray that is set', async () => {
      const expecteWindow: ManagerTypes = jest.fn() as any;
      appManager.setWindow(expecteWindow);
      expect(appManager.getWindow()).toBe(expecteWindow);
    });
  });
});
