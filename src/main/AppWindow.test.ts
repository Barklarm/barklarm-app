import { faker } from '@faker-js/faker';
import { BrowserWindow, nativeImage } from 'electron';
import { AppWindow, _hide } from './AppWindow';
import { expect, describe, it, vi, beforeEach, Mock } from 'vitest';

vi.mock('../i18n', () => ({
  translate: (val: string): string => val,
}));

vi.mock('electron', () => ({
  nativeImage: {
    createFromPath: vi.fn(),
  },
  app: {
    isPackaged: true,
  },
  BrowserWindow: vi.fn(),
}));

describe('AppWindows', () => {
  const browserWindowMock = BrowserWindow as any;
  const createFromPathMock: Mock<any> = nativeImage.createFromPath as any;
  const expectedImage = {
    setTemplateImage: vi.fn(),
  };
  const expectedBrowser = {
    setMenu: vi.fn(),
    loadURL: vi.fn(),
    on: vi.fn(),
    webContents: {
      openDevTools: vi.fn(),
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

  describe('_hide', () => {
    it('should call cancel event and hide window', () => {
      const window = { hide: vi.fn() };
      const event = { preventDefault: vi.fn() };
      const hide = _hide(window);
      hide(event);
      expect(window.hide).toBeCalled();
      expect(event.preventDefault).toBeCalled();
    });
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
          preload: expect.anything(),
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
