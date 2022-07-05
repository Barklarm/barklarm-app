import { Notification, nativeImage, NotificationConstructorOptions } from 'electron';
import { join } from 'path';
import { Status } from '../types/Status';
import { State } from '../types/State';
import { MapType } from '../types/MapType';

export class NotificationManager {
  private readonly notificationMap: MapType<(name: State) => NotificationConstructorOptions> = {
    [Status.FAILURE]: (state: State) => ({
      title: 'Fail',
      body: `${state.name} failed`,
      icon: nativeImage.createFromPath(join(__dirname, '..', 'assets', 'fail_icon_big.png')),
    }),
    [Status.SUCCESS]: (state: State) => ({
      title: 'Success',
      body: `${state.name} Success`,
      icon: nativeImage.createFromPath(join(__dirname, '..', 'assets', 'ok_icon_big.png')),
    }),
    [Status.CHECKING]: (state: State) => ({
      title: 'Checking',
      body: `${state.name} Checking`,
      icon: nativeImage.createFromPath(join(__dirname, '..', 'assets', 'running_icon_big.png')),
    }),
    [Status.NA]: (state: State) => ({
      title: 'Unaccesible',
      body: `${state.name} Unaccesible`,
      icon: nativeImage.createFromPath(join(__dirname, '..', 'assets', 'na_icon_big.png')),
    }),
  };

  public updateNotifications(old: State[], actual: State[]) {
    actual.forEach((current) => {
      const previous = old.find(({ name }) => name === current.name) || ({ status: Status.NA } as any);
      if (current.status === previous.status) return;
      return new Notification(this.notificationMap[current.status](current));
    });
  }
}
