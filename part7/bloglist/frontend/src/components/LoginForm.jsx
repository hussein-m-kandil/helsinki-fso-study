import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../reducers/authReducer.js';
import { showNotification } from '../reducers/notificationReducer.js';
import userService from '../services/user.js';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const hasEmptyFields = () => !username || !password;

  const resetForm = () => {
    setUsername('');
    setPassword('');
  };

  const handleSubmit = (e) => {
    e.target.elements.submitter.disabled = true;
    e.preventDefault();
    userService
      .login({ username, password })
      .then((userData) => {
        dispatch(login(userData));
        resetForm();
      })
      .catch((error) => {
        console.log(error?.toString() || error);
        const errMsg = error.response?.data?.error || 'Failed to log you in!';
        dispatch(showNotification(errMsg, true));
      });
  };

  return (
    <form onSubmit={handleSubmit} aria-labelledby="login-form-label">
      <h2 id="login-form-label">Log in to application</h2>
      <p>
        <label htmlFor="username">Username: </label>
        <input
          type="text"
          id="username"
          autoComplete="on"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </p>
      <p>
        <label htmlFor="password">Password: </label>
        <input
          type="password"
          id="password"
          autoComplete="on"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </p>
      <p key={new Date().valueOf()}>
        <button type="submit" name="submitter" disabled={hasEmptyFields()}>
          Login
        </button>
      </p>
    </form>
  );
}

export default LoginForm;
