import PropTypes from 'prop-types';
import { useState } from 'react';

function LoginForm({ onLogin, children }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const hasEmptyFields = () => !username || !password;

  const resetForm = () => {
    setUsername('');
    setPassword('');
  };

  const handleSubmit = (e) => {
    e.target.elements.submitter.disabled = true;
    e.preventDefault();
    onLogin({ username, password }, resetForm);
  };

  return (
    <form onSubmit={handleSubmit} aria-labelledby="login-form-label">
      <h2 id="login-form-label">Log in to application</h2>
      {children}
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

LoginForm.propTypes = {
  onLogin: PropTypes.func.isRequired,
  children: PropTypes.arrayOf(PropTypes.element),
};

export default LoginForm;
