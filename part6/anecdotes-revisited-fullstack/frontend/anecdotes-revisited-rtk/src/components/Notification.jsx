import { useSelector } from 'react-redux';

const Notification = () => {
  const notification = useSelector(({ notification }) => notification);

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
