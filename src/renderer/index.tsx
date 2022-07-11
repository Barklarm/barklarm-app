import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app';

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

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
