export {};

declare global {
  interface Window {
    electron: {
      store: {
        get: (key: string) => any;
        set: (key: string, val: any) => void;
        // any other methods you've defined...
      };
      app: {
        refreshObservers: () => void;
      };
    };
  }
}
