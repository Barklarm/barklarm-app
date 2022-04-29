import React from 'react';
import './app.scss';
import { store } from '../electron/Store';

const App = () => {
  store.set('unicorn', '🦄');
  return (
    <div className="app">
      <h1>I'm React running in Electron App{store.get('unicorn')}</h1>
    </div>
  );
}

export default App;