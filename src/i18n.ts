import { ipcMain } from 'electron';
import es from './assets/translations/es.json';
import en from './assets/translations/en.json';

let loadedLanguage: any;

const localeMap: any = {
  es,
  en,
};

export function initialize(locale: string) {
  try {
    loadedLanguage = localeMap[locale.toLowerCase()];
  } catch (error) {
    loadedLanguage = localeMap['en'];
  }
}

export function translate(id: string): string {
  return loadedLanguage[id] ?? id;
}

ipcMain.on('electron-translate-get', (event: any, id: string): void => {
  event.returnValue = translate(id);
});
