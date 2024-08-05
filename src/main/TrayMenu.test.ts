import { faker } from '@faker-js/faker';
import { State } from '../types/State';
import { Status } from '../types/Status';
import { join } from 'path';
import { Tray, nativeImage, Menu } from 'electron';
import { TrayMenu } from './TrayMenu';
import { expect, describe, it, vi, beforeEach, Mock } from 'vitest';

vi.mock('../i18n', () => ({
  translate: (val: string): string => val,
}));

vi.mock('electron', () => ({
  nativeImage: {
    createFromPath: vi.fn(),
  },
  Menu: {
    buildFromTemplate: vi.fn(),
  },
  Tray: vi.fn(),
}));

describe('TrayMenu', () => {
  const trayMock = Tray as any;
  const createFromPathMock: Mock<any> = nativeImage.createFromPath as any;
  const buildFromTemplateMock: Mock<any> = Menu.buildFromTemplate as any;
  const expectedImage = {
    setTemplateImage: vi.fn(),
  };
  const expectedTray = {
    setContextMenu: vi.fn(),
    setImage: vi.fn(),
  };
  const expectedMenu = {
    some: faker.string.alphanumeric(100),
  };
  beforeEach(() => {
    trayMock.mockClear();
    createFromPathMock.mockClear();
    buildFromTemplateMock.mockClear();
    expectedImage.setTemplateImage.mockClear();
    expectedTray.setContextMenu.mockClear();
    expectedTray.setImage.mockClear();
    createFromPathMock.mockReturnValue(expectedImage);
    buildFromTemplateMock.mockReturnValue(expectedMenu);
    trayMock.mockReturnValue(expectedTray);
  });
  describe('Constructor', () => {
    it('generates correct instance', () => {
      const tray = new TrayMenu();
      expect(createFromPathMock).toBeCalledWith(join(__dirname, '..', 'assets', 'na_icon.png'));
      expect(trayMock).toBeCalledWith(expectedImage);
      expect(buildFromTemplateMock).toHaveBeenCalledWith(tray.defaultMenuItems);
      expect(expectedTray.setContextMenu).toBeCalledWith(expectedMenu);
      expect(tray.tray).toEqual(expectedTray);
    });
  });
  describe('updateTrayImage', () => {
    it('should update the image', () => {
      const tray = new TrayMenu();
      tray.updateTrayImage({
        name: faker.lorem.word(),
        status: Status.SUCCESS,
        link: faker.internet.url(),
      });

      expect(createFromPathMock).toBeCalledWith(join(__dirname, '..', 'assets', 'ok_icon.png'));
      expect(expectedTray.setImage).toBeCalledWith(expectedImage);
    });
  });
  describe('updateObserverMenu', () => {
    it('should update the menu with the states', () => {
      const observersState: State[] = [
        {
          name: faker.lorem.word(),
          status: Status.SUCCESS,
          link: faker.internet.url(),
        },
      ];
      const expectedMenuItems: any[] = [
        {
          icon: expectedImage,
          label: observersState[0].name,
          submenu: [
            {
              click: expect.anything(),
              label: 'Link',
            },
          ],
        },
      ];
      const tray = new TrayMenu();
      tray.updateObserverMenu(observersState);
      expect(buildFromTemplateMock).toBeCalledWith([
        ...expectedMenuItems,
        { type: 'separator' },
        ...tray.defaultMenuItems,
      ]);
      expect(expectedTray.setContextMenu).toBeCalledWith(expectedMenu);
    });
  });
});
