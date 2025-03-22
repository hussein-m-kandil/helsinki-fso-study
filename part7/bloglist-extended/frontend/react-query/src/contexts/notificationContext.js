import { createContext } from 'react';

export const NotificationContext = createContext(null);

export const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'set': {
      return action.payload;
    }
    default: {
      throw TypeError('Unknown Action!');
    }
  }
};
