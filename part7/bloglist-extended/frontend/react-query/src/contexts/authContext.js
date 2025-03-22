import { createContext, useReducer } from 'react';
import { invokeLocalStorage } from '../utils/helpers';

export const AuthContext = createContext(null);

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'login': {
      const userData = action.payload;
      return userData;
    }
    case 'logout': {
      return null;
    }
    default: {
      throw TypeError('Unknown Action!');
    }
  }
};

const AUTH_DATA_KEY = 'user';
const serializedUser = invokeLocalStorage('getItem', AUTH_DATA_KEY);
const storedUserData = serializedUser ? JSON.parse(serializedUser) : null;

export const useAuth = (notifier) => {
  const [user, dispatchAuth] = useReducer(authReducer, storedUserData);

  const login = (userData) => {
    dispatchAuth({ type: 'login', payload: userData });
    notifier?.(`Hello, ${userData.name}!`);
    invokeLocalStorage('setItem', AUTH_DATA_KEY, JSON.stringify(userData));
  };

  const logout = () => {
    dispatchAuth({ type: 'logout' });
    notifier?.(`Bye bye, ${user.name}!`, true);
    invokeLocalStorage('removeItem', AUTH_DATA_KEY);
  };

  return { user, login, logout };
};
