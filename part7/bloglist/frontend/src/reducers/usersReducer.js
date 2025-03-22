import { createSlice } from '@reduxjs/toolkit';

export const { reducer: usersReducer, actions: usersActions } = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    setAll(state, action) {
      const users = action.payload;
      return users;
    },
  },
});

export default usersReducer;
