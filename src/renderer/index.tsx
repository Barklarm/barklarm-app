import React from 'react';
import ReactDOM from 'react-dom';
import { App } from "./app";

declare global {
    interface Window {
      electron: {
        store: {
          get: (key: string) => any;
          set: (key: string, val: any) => void;
          // any other methods you've defined...
        };
      };
    }
  }
  
function render() {
    ReactDOM.render(<App />, document.body);
}
  
render();