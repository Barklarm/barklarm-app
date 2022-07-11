import { faker } from '@faker-js/faker';
import { State } from '../types/State';
import { Status } from '../types/Status';
import { join } from 'path';
import { BrowserWindow, nativeImage, app } from 'electron';
import { AppWindow } from './AppWindow';

jest.mock('electron', () => ({
  nativeImage: {
    createFromPath: jest.fn(),
  },
  app: {
    isPackaged: true,
  },
  BrowserWindow: jest.fn(),
}));

describe('AppWindows', () => {
  const browserWindowMock = BrowserWindow as any;
  const createFromPathMock: jest.Mock<any> = nativeImage.createFromPath as any;
  const expectedImage = {
    setTemplateImage: jest.fn(),
  };
  const expectedBrowser = {
    setMenu: jest.fn(),
    loadURL: jest.fn(),
    on: jest.fn(),
    webContents: {
      openDevTools: jest.fn(),
    },
  };
  beforeEach(() => {
    browserWindowMock.mockClear();
    createFromPathMock.mockClear();
    expectedBrowser.setMenu.mockClear();
    expectedBrowser.loadURL.mockClear();
    expectedBrowser.on.mockClear();
    expectedImage.setTemplateImage.mockClear();
    createFromPathMock.mockReturnValue(expectedImage);
    browserWindowMock.mockReturnValue(expectedBrowser);
  });
  describe('Constructor', () => {
    it('generates correct instance', () => {
      const expectedUrl = faker.internet.url();
      const expectedPreload = faker.system.directoryPath();
      const window = new AppWindow(expectedUrl, expectedPreload);
      expect(browserWindowMock).toBeCalledWith({
        title: 'Barklarm - Configuration',
        icon: expectedImage,
        show: false,
        webPreferences: {
          preload: expectedPreload,
        },
      });
      expect(expectedBrowser.setMenu).toBeCalledWith(null);
      expect(expectedBrowser.loadURL).toBeCalledWith(expectedUrl);
      expect(expectedBrowser.on).toBeCalledWith('minimize', expect.anything());
      expect(expectedBrowser.on).toBeCalledWith('close', expect.anything());
      expect(window.window).toEqual(expectedBrowser);
    });
  });
});
