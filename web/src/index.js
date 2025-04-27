import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from '../src/redux/store';
import {Provider} from 'react-redux';
import {loadLevelFromStorage, loadSessionFromStorage, loadUserFromStorage} from "./util";
import {setSession} from "./redux/slices/sessionSlice";
import {setUser} from "./redux/slices/userSlice";
import {setLevel} from "./redux/slices/levelSlice";

const renderApp = async () => {
  const storedSession = await loadSessionFromStorage();
  if (storedSession && Object.keys(storedSession).length > 0) {
    store.dispatch(setSession({...storedSession, fromStorage: true}));
  }

  const storedUser = await loadUserFromStorage();
  if (storedUser && Object.keys(storedUser).length > 0) {
    store.dispatch(setUser({...storedUser, fromStorage: true}));
  }

  const storedLevel = await loadLevelFromStorage();
  if (storedLevel && Object.keys(storedLevel).length > 0) {
    store.dispatch(setLevel({...storedLevel, fromStorage: true}));
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