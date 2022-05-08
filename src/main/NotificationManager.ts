import { Notification, nativeImage } from 'electron';
import { join } from 'path';
import { State } from "./observers/ObserverManager";

export class NotificationManager {
    private readonly okIconPath: string = join(__dirname, '..','assets', 'ok_icon_big.png');
    private readonly FailIconPath: string = join(__dirname, '..','assets', 'fail_icon_big.png');

    public updateNotifications(old: State[], actual: State[]){
        actual.forEach(current => {
            const previous = old.find(oldState => oldState.name === current.name) || { isSuccess: true } as any
            if (!current.isSuccess && previous.isSuccess){
               return new Notification({ title: "Fail", body: `${current.name} failed`, icon: nativeImage.createFromPath(this.FailIconPath)}).show()
            }
            if (current.isSuccess && !previous.isSuccess){
               return new Notification({ title: "Fix", body: `${current.name} fixed`, icon: nativeImage.createFromPath(this.okIconPath)}).show()
            }
        })
    }
}