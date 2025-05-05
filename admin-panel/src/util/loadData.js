import localforage from "localforage";

const loadFromStorage = async (key) => {
  try {
    const data = await localforage.getItem(key);
    console.log(`loading ${key} from storage...`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error loading ${key} from LocalStorage:`, error);
    return null;
  }
};

export const loadSessionFromStorage = () => loadFromStorage('session');