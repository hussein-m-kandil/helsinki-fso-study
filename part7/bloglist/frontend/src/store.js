import { configureStore } from '@reduxjs/toolkit';
import { invokeLocalStorage } from './utils/helpers.js';
import auth, { authActions } from './reducers/authReducer.js';
import notification from './reducers/notificationReducer.js';
import blogs from './reducers/blogsReducer.js';
import users from './reducers/usersReducer.js';

const reducer = { notification, blogs, users, auth };
export const store = configureStore({ reducer });

const serializedUser = invokeLocalStorage('getItem', 'user');
const storedUserData = serializedUser ? JSON.parse(serializedUser) : null;
if (storedUserData) store.dispatch(authActions.login(storedUserData));

export default store;
