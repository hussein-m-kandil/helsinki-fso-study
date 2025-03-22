import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { blogsActions } from './reducers/blogsReducer.js';
import { usersActions } from './reducers/usersReducer.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm.jsx';
import Bloglist from './components/Bloglist.jsx';
import blogService from './services/blog.js';
import userService from './services/user.js';
import Users from './components/Users.jsx';
import User from './components/User.jsx';
import Blog from './components/Blog.jsx';
import Navbar from './components/Navbar.jsx';
import Alert from './components/Alert.jsx';

function App() {
  const user = useSelector(({ auth }) => auth);

  const dispatch = useDispatch();

  useEffect(() => {
    blogService.getAll().then((blogs) => dispatch(blogsActions.setAll(blogs)));
    userService.getAll().then((users) => dispatch(usersActions.setAll(users)));
  }, [dispatch]);

  return (
    <>
      <Router>
        <Navbar />
        <Alert />
        {!user ? (
          <LoginForm />
        ) : (
          <Routes>
            <Route path="/" element={<Bloglist />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/:id" element={<User />} />
            <Route path="/blogs/:id" element={<Blog />} />
          </Routes>
        )}
      </Router>
    </>
  );
}

export default App;
