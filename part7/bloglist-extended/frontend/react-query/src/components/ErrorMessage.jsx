import PropTypes from 'prop-types';

const ErrorMessage = ({ message }) => {
  return <div className="text-sm text-center my-6 text-red-700">{message}</div>;
};

ErrorMessage.propTypes = { message: PropTypes.string.isRequired };

export default ErrorMessage;
