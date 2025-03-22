import { useEffect } from 'react';
import { HeroUIProvider, Alert } from '@heroui/react';
import { useDispatch, useSelector } from 'react-redux';
import { blogsActions } from './reducers/blogsReducer.js';
import { usersActions } from './reducers/usersReducer.js';
import { notificationActions } from './reducers/notificationReducer.js';
import { Routes, Route, useHref, useNavigate } from 'react-router-dom';
import LoginForm from './components/LoginForm.jsx';
import Bloglist from './components/Bloglist.jsx';
import BlogForm from './components/BlogForm.jsx';
import Navbar from './components/Navbar.jsx';
import blogService from './services/blog.js';
import userService from './services/user.js';
import Users from './components/Users.jsx';
import User from './components/User.jsx';
import Blog from './components/Blog.jsx';

function App() {
  const navigate = useNavigate();

  const user = useSelector(({ auth }) => auth);
  const notificationData = useSelector(({ notification }) => notification);

  const dispatch = useDispatch();

  useEffect(() => {
    blogService.getAll().then((blogs) => dispatch(blogsActions.setAll(blogs)));
    userService.getAll().then((users) => dispatch(usersActions.setAll(users)));
  }, [dispatch]);

  return (
    <HeroUIProvider navigate={navigate} useHref={useHref}>
      <Navbar />
      <div className="fixed bottom-4 right-4 z-50" aria-live="assertive">
        <Alert
          isVisible={notificationData && notificationData.msg}
          color={notificationData?.isError ? 'danger' : 'success'}
          title={notificationData?.msg || ''}
          isClosable={true}
          onClose={() => dispatch(notificationActions.set(null))}
        />
      </div>
      <div className="max-w-[1024px] mx-auto px-6">
        {!user ? (
          <LoginForm />
        ) : (
          <Routes>
            <Route path="/" element={<Bloglist />} />
            <Route path="/blogs/new" element={<BlogForm />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/:id" element={<User />} />
            <Route path="/blogs/:id" element={<Blog />} />
          </Routes>
        )}
      </div>
    </HeroUIProvider>
  );
}

export default App;
