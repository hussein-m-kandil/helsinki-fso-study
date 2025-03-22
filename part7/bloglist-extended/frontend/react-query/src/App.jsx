import { useReducer, useRef } from 'react';
import { HeroUIProvider, Alert } from '@heroui/react';
import { AuthContext, useAuth } from './contexts/authContext.js';
import { Routes, Route, useHref, useNavigate } from 'react-router-dom';
import {
  NotificationContext,
  notificationReducer,
} from './contexts/notificationContext.js';
import LoginForm from './components/LoginForm.jsx';
import Bloglist from './components/Bloglist.jsx';
import BlogForm from './components/BlogForm.jsx';
import Navbar from './components/Navbar.jsx';
import Users from './components/Users.jsx';
import User from './components/User.jsx';
import Blog from './components/Blog.jsx';

const INITIAL_NOTIFICATION = { msg: '', isError: false };

function App() {
  const navigate = useNavigate();

  const [notificationData, dispatchNotification] = useReducer(
    notificationReducer,
    INITIAL_NOTIFICATION
  );

  const notificationTimeoutRef = useRef(null);

  const showNotification = (msg, isError = false, timeoutMS = 3000) => {
    clearTimeout(notificationTimeoutRef.current);
    dispatchNotification({ type: 'set', payload: { msg, isError } });
    notificationTimeoutRef.current = setTimeout(
      () =>
        dispatchNotification({ type: 'set', payload: INITIAL_NOTIFICATION }),
      timeoutMS
    );
  };

  const { user, login, logout } = useAuth(showNotification);

  return (
    <HeroUIProvider navigate={navigate} useHref={useHref}>
      <AuthContext value={{ user, login, logout }}>
        <NotificationContext value={{ showNotification }}>
          <Navbar />
          <div className="fixed bottom-4 right-4 z-50" aria-live="assertive">
            <Alert
              isVisible={notificationData && notificationData.msg}
              color={notificationData?.isError ? 'danger' : 'success'}
              title={notificationData?.msg || ''}
              isClosable={true}
              onClose={() =>
                dispatchNotification({
                  type: 'set',
                  payload: INITIAL_NOTIFICATION,
                })
              }
            />
          </div>
          <div className="max-w-[1024px] mx-auto px-6">
            {!user ? (
              <LoginForm />
            ) : (
              <Routes>
                <Route path={'/'} element={<Bloglist />} />
                <Route path={'/blogs/new'} element={<BlogForm />} />
                <Route path={'/users'} element={<Users />} />
                <Route path={'/users/:id'} element={<User />} />
                <Route path={'/blogs/:id'} element={<Blog />} />
              </Routes>
            )}
          </div>
        </NotificationContext>
      </AuthContext>
    </HeroUIProvider>
  );
}

export default App;
