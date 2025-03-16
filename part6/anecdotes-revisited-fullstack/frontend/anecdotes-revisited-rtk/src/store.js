import { configureStore } from '@reduxjs/toolkit';
import filterSlice from './slices/filterSlice.js';
import anecdoteSlice from './slices/anecdoteSlice.js';
import notificationSlice from './slices/notificationSlice.js';

export const store = configureStore({
  reducer: {
    notification: notificationSlice,
    anecdotes: anecdoteSlice,
    filter: filterSlice,
  },
});

export default store;
