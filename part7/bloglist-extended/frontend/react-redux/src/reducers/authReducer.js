import { createSlice } from '@reduxjs/toolkit';
import { invokeLocalStorage } from '../utils/helpers';
import { showNotification } from './notificationReducer';

export const { reducer: authReducer, actions: authActions } = createSlice({
  name: 'auth',
  initialState: null,
  reducers: {
    login(state, action) {
      const userData = action.payload;
      return userData;
    },
    logout() {
      return null;
    },
  },
});

const AUTH_DATA_KEY = 'user';

export const login = (userData) => (dispatch) => {
  dispatch(authActions.login(userData));
  dispatch(showNotification(`Hello, ${userData.name}!`));
  invokeLocalStorage('setItem', AUTH_DATA_KEY, JSON.stringify(userData));
};

export const logout = () => (dispatch, getState) => {
  const user = getState().auth;
  dispatch(authActions.logout());
  dispatch(showNotification(`Bye bye, ${user.name}!`));
  invokeLocalStorage('removeItem', AUTH_DATA_KEY);
};

export default authReducer;
