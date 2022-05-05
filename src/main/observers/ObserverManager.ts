import { GithubAction } from "./GithubAction"
import { store } from "../../store"

export type State = {
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

    refershFromStore(){
        this.observers = (store.get("observables") as ObserverConfiguration[]).map((configuration: ObserverConfiguration) => {
            if(configuration.type === "githubAction")
                return new GithubAction(configuration as any)
        })
    }

    public async getAggregatedState(): Promise<State> {
        const aggregatedStates: State[] = await Promise.all(this.observers.map(observer => observer.getState()))
        return {
            isReachable: aggregatedStates.some((state: State) => state.isReachable),
            isRunning: aggregatedStates.some((state: State) => state.isRunning),
            isSuccess: aggregatedStates.every((state: State) => state.isSuccess),
        }
    }
}

export const observerManager = new ObserverManager();