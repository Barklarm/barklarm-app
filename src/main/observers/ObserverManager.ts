import { GithubAction } from "./GithubAction"
import { store } from "../../store"
import { TrayMenu } from "../TrayMenu"
import { NotificationManager } from "../NotificationManager"
import { State } from "../../types/State"
import { Observer } from "../../types/Observer"
import { ObserverConfiguration } from "../../types/ObserverConfiguration"
import { Status } from "../../types/Status"

export class ObserverManager {
    private observers: Observer[];
    private globalState: State;
    private observersState: State[];

    constructor(private tray: TrayMenu, private notifications: NotificationManager, enableRefresh: boolean = true){
        enableRefresh && setInterval(this.refreshState.bind(this), 60000);
    }

    private calculateGlobalStatus(states: State[]) {
        if(states.some((state: State) => state.status === Status.FAILURE))
            return Status.FAILURE;
        else if(states.some((state: State) => state.status === Status.NA))
            return Status.NA
        else if(states.some((state: State) => state.status === Status.CHECKING))
            return Status.CHECKING
        return Status. SUCCESS
    }

    public async refreshState(){
        const oldStates = this.observersState || [];
        this.observersState = await Promise.all(this.observers.map(observer => observer.getState()))
        this.globalState = {
            name: "Global",
            status: this.calculateGlobalStatus(this.observersState),
        }
        
        this.notifications.updateNotifications(oldStates, this.observersState);
        this.tray.updateTrayImage(this.globalState)
        this.tray.updateObserverMenu(this.observersState)
    }

    public async refershObservers(){
        this.observers = (store.get("observables") as ObserverConfiguration[]).map((configuration: ObserverConfiguration) => {
            if(configuration.type === "githubAction")
                return new GithubAction(configuration as any)
        })
        this.refreshState()
    }
}