import { useSelector } from 'react-redux';

const Alert = () => {
  const notificationData = useSelector(({ notification }) => notification);

  return (
    <div role="alert">
      {notificationData &&
        notificationData.msg &&
        (notificationData.isError ? (
          <div className="error message">{notificationData.msg}</div>
        ) : (
          <div className="message">{notificationData.msg}</div>
        ))}
    </div>
  );
};

export default Alert;
