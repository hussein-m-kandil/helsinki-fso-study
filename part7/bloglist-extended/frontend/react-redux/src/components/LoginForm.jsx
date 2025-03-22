import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../reducers/authReducer.js';
import { showNotification } from '../reducers/notificationReducer.js';
import { Form, Input, Button } from '@heroui/react';
import userService from '../services/user.js';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [disabled, setDisabled] = useState(false);

  const dispatch = useDispatch();

  const hasEmptyFields = () => !username || !password;

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setDisabled(false);
  };

  const handleSubmit = (e) => {
    setDisabled(true);
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
        setDisabled(false);
      });
  };

  return (
    <Form
      className="w-full max-w-xs flex flex-col gap-4 mx-auto mt-8"
      onSubmit={handleSubmit}
      aria-labelledby="login-form-label"
    >
      <h2
        id="login-form-label"
        className="font-bold text-xl text-center w-full"
      >
        Log in to application
      </h2>
      <p className="text-xs font-light text-center">
        You can use these account credentials:{' '}
        <span className="font-normal italic">batman - Bb@12312</span>
      </p>
      <Input
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your username"
        labelPlacement="outside"
        isDisabled={disabled}
        autoComplete="on"
        value={username}
        label="Username"
        id="username"
        type="text"
        isRequired
      />
      <Input
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        labelPlacement="outside"
        isDisabled={disabled}
        autoComplete="on"
        value={password}
        label="Password"
        type="password"
        id="password"
        isRequired
      />
      <div className="flex gap-2" key={new Date().valueOf()}>
        <Button
          isDisabled={hasEmptyFields() || disabled}
          name="submitter"
          color="primary"
          type="submit"
        >
          Login
        </Button>
      </div>
    </Form>
  );
}

export default LoginForm;
