import { Notification, nativeImage, NotificationConstructorOptions } from 'electron';
import { join } from 'path';
import { Status } from '../types/Status';
import { State } from '../types/State';
import { MapType } from '../types/MapType';
import { translate } from '../i18n';
import { NotificationsConfiguration, NotificationConfiguration } from '../types/NotificationEnabled';

export class NotificationManager {
  private readonly notificationMap: MapType<(name: State) => NotificationConstructorOptions> = {
    [Status.FAILURE]: (state: State) => ({
      title: translate('Failed'),
      body: `${state.name} ${translate('Failed')}`,
      icon: nativeImage.createFromPath(join(__dirname, '..', 'assets', 'fail_icon_big.png')),
    }),
    [Status.SUCCESS]: (state: State) => ({
      title: translate('Succeeded'),
      body: `${state.name} ${translate('Succeeded')}`,
      icon: nativeImage.createFromPath(join(__dirname, '..', 'assets', 'ok_icon_big.png')),
    }),
    [Status.CHECKING]: (state: State) => ({
      title: translate('Checking'),
      body: `${state.name} ${translate('Checking')}`,
      icon: nativeImage.createFromPath(join(__dirname, '..', 'assets', 'running_icon_big.png')),
    }),
    [Status.NA]: (state: State) => ({
      title: translate('Unaccesible'),
      body: `${state.name} ${translate('Unaccesible')}`,
      icon: nativeImage.createFromPath(join(__dirname, '..', 'assets', 'na_icon_big.png')),
    }),
  };

  private config: NotificationsConfiguration;

  constructor(config: NotificationsConfiguration) {
    this.config = config;
  }

  public updateNotifications(old: State[], actual: State[]) {
    if (!this.areActive()) return;
    actual.forEach((current) => {
      const previous = old.find(({ name }) => name === current.name) || ({ status: Status.NA } as any);
      if (current.status === previous.status) return;
      return new Notification(this.notificationMap[current.status](current));
    });
  }

  private areActive() {
    const now: Date = new Date();
    return this.config.datetime
      .map((dayconfig: NotificationConfiguration) => {
        if (dayconfig.weekday !== now.getDay()) return false;
        const begin: Date = new Date();
        begin.setHours(dayconfig.enableTime.hour, dayconfig.enableTime.minute);
        const end: Date = new Date();
        end.setHours(dayconfig.disableTime.hour, dayconfig.disableTime.minute);
        return now >= begin && now <= end;
      })
      .includes(true);
  }
}
