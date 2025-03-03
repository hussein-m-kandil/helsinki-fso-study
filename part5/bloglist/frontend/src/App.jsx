import { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm.jsx';
import blogService from './services/blogs.js';
import userService from './services/user.js';
import Blog from './components/Blog.jsx';
import CreateBlogForm from './components/CreateBlogForm.jsx';

let savedUser = null;

try {
  const serializedUser = localStorage.getItem('user');
  if (serializedUser) savedUser = JSON.parse(serializedUser);
} catch (error) {
  console.log(error?.toString() || error);
}

function App() {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(savedUser);
  const [toastData, setToastData] = useState();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  const toast = (msg, isError = false, timeoutMS = 3000) => {
    const timeoutId = setTimeout(() => setToastData(null), timeoutMS);
    setToastData({ msg, isError, timeoutId });
  };

  const resetToast = () => {
    clearTimeout(toastData?.timeoutId);
    setToastData(null);
  };

  const generateErrorHandler = (defaultMessage) => {
    return (error) => {
      console.log(error?.toString() || error);
      toast(error.response?.data?.error || defaultMessage, true);
    };
  };

  const handleLogin = (credentials, resetLoginForm) => {
    resetToast();
    userService
      .login(credentials)
      .then((loggedInUser) => {
        setUser(loggedInUser);
        try {
          localStorage.setItem('user', JSON.stringify(loggedInUser));
        } catch (error) {
          console.log(error?.toString() || error);
        }
        resetLoginForm();
        toast(`Hello, ${loggedInUser.name}!`);
      })
      .catch(generateErrorHandler('Login failed'));
  };

  const handleCreateBlog = (blog, resetCreateBlogForm) => {
    resetToast();
    blogService
      .post(blog, user.token)
      .then((createdBlog) => {
        setBlogs([...blogs, createdBlog]);
        resetCreateBlogForm();
        toast(`${blog.title} blog created!`);
      })
      .catch(generateErrorHandler('Blog creation failed'));
  };

  const handleLogout = () => {
    setUser(null);
    try {
      localStorage.removeItem('user');
    } catch (error) {
      console.log(error?.toString() || error);
    }
  };

  const toastMessage =
    toastData && toastData.isError ? (
      <div className="error message">{toastData.msg}</div>
    ) : (
      toastData && <div className="message">{toastData.msg}</div>
    );

  return (
    <>
      <h1>Bloglist</h1>
      {user === null ? (
        <div>
          <h2>Log in to application</h2>
          {toastMessage}
          <LoginForm onLogin={handleLogin} />
        </div>
      ) : (
        <div>
          <h2>blogs</h2>
          {toastMessage}
          <p>
            {`${user.name} is logged in! `}
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          </p>
          <hr />
          <CreateBlogForm onCreate={handleCreateBlog} />
          <hr />
          <ul>
            {blogs.map((blog) => (
              <Blog key={blog.id} blog={blog} />
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default App;
