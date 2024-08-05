import { appManager } from './AppManager';
import { expect, describe, it, vi } from 'vitest';
import { ManagerTypes } from '../types/ManagerTypes';
import { TrayMenu } from './TrayMenu';

describe('appManager', () => {
  describe('Tray Management', () => {
    it('shoulds return the same tray that is set', async () => {
      const expecteTray: TrayMenu = vi.fn() as any;
      appManager.setTray(expecteTray);
      expect(appManager.getTray()).toBe(expecteTray);
    });
  });
  describe('Window Management', () => {
    it('shoulds return the same tray that is set', async () => {
      const expecteWindow: ManagerTypes = vi.fn() as any;
      appManager.setWindow(expecteWindow);
      expect(appManager.getWindow()).toBe(expecteWindow);
    });
  });
});
