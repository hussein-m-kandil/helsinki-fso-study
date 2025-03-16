import React from 'react';
import ReactDOM from 'react-dom/client';

import { createStore } from 'redux';
import reducer from './reducer';

const store = createStore(reducer);

// eslint-disable-next-line react-refresh/only-export-components
const App = () => {
  const createDispatcher = (type) => () => store.dispatch({ type });

  const { good, bad, ok } = store.getState();

  return (
    <div>
      <button onClick={createDispatcher('ZERO')}>reset stats</button>
      <button onClick={createDispatcher('GOOD')}>good</button>
      <button onClick={createDispatcher('BAD')}>bad</button>
      <button onClick={createDispatcher('OK')}>ok</button>
      <div>good {good}</div>
      <div>bad {bad}</div>
      <div>ok {ok}</div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));

const renderApp = () => {
  root.render(<App />);
};

renderApp();
store.subscribe(renderApp);
