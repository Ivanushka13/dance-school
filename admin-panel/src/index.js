import React from 'react';
import './index.css';
import App from "./App";
import reportWebVitals from './reportWebVitals';
import {loadSessionFromStorage} from "./util/loadData";
import {Provider} from "react-redux";
import ReactDOM from 'react-dom/client';
import {setSession} from "./redux/sessionSlice";
import store from "./redux/store";

const renderApp = async () => {
  const storedSession = await loadSessionFromStorage();
  if (storedSession && Object.keys(storedSession).length > 0) {
    store.dispatch(setSession({...storedSession, fromStorage: true}));
  }
}

await renderApp();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App/>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();