import {configureStore} from '@reduxjs/toolkit';
import {persistSessionMiddleware} from "./middleware";
import sessionReducer from "./sessionSlice";

const store = configureStore({
  reducer: {
    session: sessionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      persistSessionMiddleware
    ])
});

export default store;
