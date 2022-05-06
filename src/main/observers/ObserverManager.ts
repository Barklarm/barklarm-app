import { GithubAction } from "./GithubAction"
import { store } from "../../store"
import { TrayMenu } from "../TrayMenu"
import { NotificationManager } from "../NotificationManager"

export type State = {
    name: string
    isReachable: boolean
    isRunning?: boolean
    isSuccess?: boolean 
}

export interface Observer {
    getState(): Promise<State>
  }
  
export type ObserverConfiguration = {
    type: string
}


export class ObserverManager {
    private observers: Observer[];
    private globalState: State;
    private observersState: State[];

    constructor(private tray: TrayMenu, private notifications: NotificationManager){
        setInterval(this.refreshState.bind(this), 60000);
    }

    public async refreshState(){
        const oldStates = this.observersState || [];
        this.observersState = await Promise.all(this.observers.map(observer => observer.getState()))
        this.globalState = {
            name: "Global",
            isReachable: this.observersState.some((state: State) => state.isReachable),
            isRunning: this.observersState.some((state: State) => state.isRunning),
            isSuccess: this.observersState.every((state: State) => state.isSuccess),
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