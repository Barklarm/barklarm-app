export {};

declare global {
  interface Window {
    electron: {
      store: {
        get: (key: string) => any;
        set: (key: string, val: any) => void;
        import: () => boolean;
        export: () => boolean;
      };
      translations: {
        translate: (id: string) => string;
      };
      app: {
        refreshObservers: () => void;
      };
    };
  }
}
