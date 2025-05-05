import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user_id: '',
  id: '',
  user: {}
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSession(state, action) {
      const {
        user_id,
        id,
        user,
      } = action.payload;
      state.user_id = user_id;
      state.id = id;
      state.user = user;
    },
    clearSession(state) {
      return initialState;
    },
    updateSessionField(state, action) {
      const payload = action.payload;
      const updatedState = { ...state };

      Object.keys(payload).forEach((key) => {
        if (key in state) {
          updatedState[key] = payload[key];
        }
      });

      return updatedState;
    },
  },
});

export const {
  setSession,
  clearSession,
  updateSessionField
} = sessionSlice.actions;

export default sessionSlice.reducer;
