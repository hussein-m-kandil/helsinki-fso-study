import { useContext } from 'react';
import NotificationContext from '../NotificationContext.js';

const Notification = () => {
  const { notification } = useContext(NotificationContext);

  return (
    notification && (
      <div
        style={{
          padding: 10,
          borderWidth: 1,
          marginBottom: 5,
          border: 'solid',
          backgroundColor: '#fff',
          position: 'fixed',
          right: '1rem',
          width: '35%',
          top: '1rem',
        }}
      >
        {notification}
      </div>
    )
  );
};

export default Notification;
