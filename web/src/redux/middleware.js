import localforage from "localforage";

const createPersistMiddleware = ({ storageKey, actionPrefix, reducerKey, clearAction }) => {
  return store => next => action => {
    const result = next(action);
    if (action.type === `${actionPrefix}${clearAction}`) {
      localforage.removeItem(storageKey)
        .then(async () => {
          const data = await localforage.getItem(storageKey);
          console.log(`${storageKey}:`, data);
        })
        .catch(error => console.error(`Error removing ${storageKey} from LocalStorage:`, error));
    } else if (action.type.startsWith(actionPrefix) && !action.payload?.fromStorage) {
      const state = store.getState()[reducerKey];
      localforage.setItem(storageKey, JSON.stringify(state))
        .catch(error => console.error(`Error saving ${storageKey} to LocalStorage:`, error));
    }

    return result;
  };
};

export const persistSessionMiddleware = createPersistMiddleware({
  storageKey: 'session',
  actionPrefix: 'session/',
  reducerKey: 'session',
  clearAction: 'clearSession',
});

export const persistUserMiddleware = createPersistMiddleware({
  storageKey: 'user',
  actionPrefix: 'user/',
  reducerKey: 'user',
  clearAction: 'clearUser',
});

export const persistLevelMiddleware = createPersistMiddleware({
  storageKey: 'level',
  actionPrefix: 'level/',
  reducerKey: 'level',
  clearAction: 'clearLevel',
});