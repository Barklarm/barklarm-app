import { NotificationConfiguration } from '../../../../types/NotificationEnabled';

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
  saveAutostart: (autostart: boolean): void => {
    electron.store.set('autostart', autostart);
  },
  getAutostart: (): boolean => {
    return electron.store.get('autostart');
  },
  saveNotificationSchedule: (schedule: Array<NotificationConfiguration>): void => {
    electron.store.set('notificationSchedule', schedule);
  },
  getNotificationSchedule: (): Array<NotificationConfiguration> => {
    return electron.store.get('notificationSchedule');
  },
  importConfig: (): boolean => {
    return electron.store.import();
  },
  exportConfig: (): boolean => {
    return electron.store.export();
  },
});
