import { Notification, nativeImage } from 'electron';
import { join } from 'path';
import { Status } from '../types/Status';
import { State } from "../types/State";

export class NotificationManager {
    private readonly okIconPath: string = join(__dirname, '..','assets', 'ok_icon_big.png');
    private readonly FailIconPath: string = join(__dirname, '..','assets', 'fail_icon_big.png');

    public updateNotifications(old: State[], actual: State[]){
        actual.forEach(current => {
            const previous = old.find(({name}) => name === current.name) || { status: Status.NA } as any
            if (previous.status === Status.SUCCESS  && current.status === Status.FAILURE){
               return new Notification({ title: "Fail", body: `${current.name} failed`, icon: nativeImage.createFromPath(this.FailIconPath)}).show()
            }
            if (previous.status === Status.FAILURE && current.status === Status.SUCCESS){
               return new Notification({ title: "Fix", body: `${current.name} fixed`, icon: nativeImage.createFromPath(this.okIconPath)}).show()
            }
        })
    }
}