import { Status } from "./Status";

export type State = {
    name: string;
    status: Status;
    isReachable: boolean;
    isRunning?: boolean;
    isSuccess?: boolean;
};
