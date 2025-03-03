import PropTypes from 'prop-types';
import { useState } from 'react';

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const resetForm = () => {
    setUsername('');
    setPassword('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ username, password }, resetForm);
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <p>
        <button type="submit">Login</button>
      </p>
    </form>
  );
}

LoginForm.propTypes = { onLogin: PropTypes.func.isRequired };

export default LoginForm;
