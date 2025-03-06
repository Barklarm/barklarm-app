export const storage = (electron: any) => ({
  saveAutoupdate: (autoupdate: boolean): void => {
    electron.store.set('autoupdate', autoupdate);
  },
  getAutoupdate: (): boolean => {
    return electron.store.get('autoupdate');
  },
  saveSslDisabled: (sslDisabled: boolean): void => {
    electron.store.set('sslDisabled', sslDisabled);
  },
  getSslDisabled: (): boolean => {
    return electron.store.get('sslDisabled');
  },
  saveRefreshInterval: (refreshInterval: number): void => {
    electron.store.set('refreshInterval', refreshInterval);
  },
  getRefreshInterval: (): number => {
    return electron.store.get('refreshInterval');
  },
  saveIssuesSystemUrl: (issuesSystemUrl?: string): void => {
    electron.store.set('issuesSystemUrl', issuesSystemUrl);
  },
  getIssuesSystemUrl: (): string => {
    return electron.store.get('issuesSystemUrl');
  },
  saveAutostart: (autostart: boolean): void => {
    electron.store.set('autostart', autostart);
  },
  getAutostart: (): boolean => {
    return electron.store.get('autostart');
  },
  importConfig: (): boolean => {
    return electron.store.import();
  },
  exportConfig: (): boolean => {
    return electron.store.export();
  },
});
