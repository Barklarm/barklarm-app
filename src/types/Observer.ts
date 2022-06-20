import { State } from "./State";


export interface Observer {
    getState(): Promise<State>;
}
