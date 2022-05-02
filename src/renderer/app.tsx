import React from 'react';

export const App = () => {
    window.electron.store.set("unicorn", "🦄");
    return (<>I'm a {window.electron.store.get("unicorn")}</>);
}