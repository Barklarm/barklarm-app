export const storage = (electron: any) => ({
  saveAutoupdate: (autoupdate: boolean): void => {
    electron.store.set('autoupdate', autoupdate);
  },
  getAutoupdate: (): boolean => {
    return electron.store.get('autoupdate');
  },
  importConfig: (): boolean => {
    return electron.store.import();
  },
  exportConfig: (): boolean => {
    return electron.store.export();
  },
});
