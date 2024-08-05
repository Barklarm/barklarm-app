import { ipcMain } from 'electron';
import { join } from 'path';
import { existsSync, readFileSync } from 'fs';
import { MapType } from './types/MapType';

let loadedLanguage: MapType<string>;

export function initialize(locale: string) {
  loadedLanguage = existsSync(join(__dirname, '..', 'assets', 'translations', locale.toLowerCase() + '.json'))
    ? JSON.parse(readFileSync(join(__dirname, '..', 'assets', 'translations', locale + '.json'), 'utf8'))
    : JSON.parse(readFileSync(join(__dirname, '..', 'assets', 'translations', 'en.json'), 'utf8'));
}

export function translate(id: string): string {
  return loadedLanguage[id] ?? id;
}

ipcMain.on('electron-translate-get', (event: any, id: string): void => {
  event.returnValue = translate(id);
});
