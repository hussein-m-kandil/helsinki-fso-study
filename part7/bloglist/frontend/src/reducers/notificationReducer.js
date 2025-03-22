import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: { msg: '', isError: false },
  reducers: { setData: (state, action) => action.payload },
});

let timeoutId = null;

export const showNotification = (msg, isError = false, timeoutMS = 3000) => {
  return (dispatch) => {
    clearTimeout(timeoutId);
    dispatch(notificationSlice.actions.setData({ msg, isError }));
    timeoutId = timeoutId = setTimeout(
      () => dispatch(notificationSlice.actions.setData(null)),
      timeoutMS
    );
  };
};

export default notificationSlice.reducer;
