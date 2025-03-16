import { useReducer, useRef } from 'react';
import NotificationContext from '../NotificationContext';

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'set': {
      return action.payload;
    }
    case 'clear': {
      return null;
    }
    default: {
      return state;
    }
  }
};

const NotificationContextProvider = ({ children }) => {
  const [notification, dispatchNotification] = useReducer(
    notificationReducer,
    null
  );

  const timeoutIdRef = useRef(null);

  const setNotification = (message, timeoutMS = 3000) => {
    clearTimeout(timeoutIdRef.current);
    dispatchNotification({ type: 'set', payload: message });
    timeoutIdRef.current = setTimeout(() => {
      dispatchNotification({ type: 'clear' });
    }, timeoutMS);
  };

  return (
    <NotificationContext value={{ notification, setNotification }}>
      {children}
    </NotificationContext>
  );
};

export default NotificationContextProvider;
