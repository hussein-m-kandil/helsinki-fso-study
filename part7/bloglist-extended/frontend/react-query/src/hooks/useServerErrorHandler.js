import { useContext } from 'react';
import { AuthContext } from '../contexts/authContext';
import { NotificationContext } from '../contexts/notificationContext';

export const useServerErrorHandler = () => {
  const { showNotification } = useContext(NotificationContext);
  const { logout } = useContext(AuthContext);

  return (error, defaultMessage) => {
    console.log(error.toString?.() || error);
    const errMsg = error.response?.data?.error || defaultMessage;
    showNotification(errMsg, true);
    if (error.response?.status === 401) logout();
  };
};

export default useServerErrorHandler;
