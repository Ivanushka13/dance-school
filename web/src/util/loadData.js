import localforage from "localforage";

const loadFromStorage = async (key) => {
    try {
        const data = await localforage.getItem(key);
        console.log(`loading ${key} from storage: ${JSON.stringify(data)}`);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error(`Error loading ${key} from LocalStorage:`, error);
        return null;
    }
};

export const loadSessionFromStorage = () => loadFromStorage('session');
export const loadUserFromStorage = () => loadFromStorage('user');
export const loadLevelFromStorage = () => loadFromStorage('level');