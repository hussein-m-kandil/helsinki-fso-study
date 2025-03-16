import { createSlice } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    setMessage: (state, { payload: message }) => message,
  },
});

let timeoutId = null;

export const setNotification = (message, timeoutMS) => {
  return (dispatch) => {
    dispatch(actions.setMessage(message));
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      dispatch(actions.setMessage(''));
      timeoutId = null;
    }, timeoutMS);
  };
};

export default reducer;
