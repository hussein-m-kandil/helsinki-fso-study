import { createSlice } from '@reduxjs/toolkit';

export const { reducer: notificationReducer, actions: notificationActions } =
  createSlice({
    name: 'notification',
    initialState: { msg: '', isError: false },
    reducers: { set: (state, action) => action.payload },
  });

let timeoutId = null;

export const showNotification = (msg, isError = false, timeoutMS = 3000) => {
  return (dispatch) => {
    clearTimeout(timeoutId);
    dispatch(notificationActions.set({ msg, isError }));
    timeoutId = timeoutId = setTimeout(
      () => dispatch(notificationActions.set(null)),
      timeoutMS
    );
  };
};

export default notificationReducer;
