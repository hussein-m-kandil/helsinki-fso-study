import { useState, useEffect } from 'react';
import BlogForm from './components/BlogForm.jsx';
import Togglable from './components/Togglable.jsx';
import LoginForm from './components/LoginForm.jsx';
import blogService from './services/blogs.js';
import userService from './services/user.js';
import Blog from './components/Blog.jsx';

const invokeLocalStorage = (method, ...args) => {
  try {
    return localStorage[method](...args);
  } catch (error) {
    console.log(error?.toString() || error);
  }
};

const serializedUser = invokeLocalStorage('getItem', 'user');
const savedUser = serializedUser ? JSON.parse(serializedUser) : null;

function App() {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(savedUser);
  const [toastData, setToastData] = useState(null);
  const [blogFormKey, setBlogFormKey] = useState(new Date().valueOf());

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
      if (error.response.status === 401) {
        setUser(null);
        invokeLocalStorage('removeItem', 'user');
      }
    };
  };

  const handleLogin = (credentials, resetLoginForm) => {
    resetToast();
    userService
      .login(credentials)
      .then((loggedInUser) => {
        setUser(loggedInUser);
        invokeLocalStorage('setItem', 'user', JSON.stringify(loggedInUser));
        resetLoginForm();
        toast(`Hello, ${loggedInUser.name}!`);
      })
      .catch(generateErrorHandler('Failed to log you in'));
  };

  const handleCreateBlog = (blog, resetCreateBlogForm) => {
    resetToast();
    blogService
      .post(blog, user.token)
      .then((createdBlog) => {
        setBlogs([...blogs, createdBlog]);
        setBlogFormKey(new Date().valueOf());
        resetCreateBlogForm();
        toast(`${blog.title} blog created!`);
      })
      .catch(generateErrorHandler('Failed to create a blog'));
  };

  const replaceBlog = (blogId, ...newBlogs) => {
    const index = blogs.findIndex(({ id }) => id === blogId);
    if (index < 0) throw new Error('Something wrong!');
    const otherBlogsHead = blogs.slice(0, index);
    const otherBlogsTail = blogs.slice(index + 1);
    return otherBlogsHead.concat(newBlogs, otherBlogsTail);
  };

  const handleLikeBlog = (blog) => {
    const likedBlog = { ...blog, likes: blog.likes + 1 };
    resetToast();
    blogService
      .put(likedBlog, user.token)
      .then((updatedBlog) => {
        setBlogs(replaceBlog(blog.id, updatedBlog));
        toast(`${blog.title} blog liked!`);
      })
      .catch(generateErrorHandler('Failed to like a blog'));
  };

  const handleRemoveBlog = (blog) => {
    resetToast();
    blogService
      .delete(blog, user.token)
      .then(() => {
        setBlogs(replaceBlog(blog.id));
        toast(`${blog.title} blog deleted!`);
      })
      .catch(generateErrorHandler('Failed to delete a blog'));
  };

  const handleLogout = () => {
    setUser(null);
    invokeLocalStorage('removeItem', 'user');
  };

  const sortByLikesDesc = (blogA, blogB) => blogB.likes - blogA.likes;

  const toastMessage = (
    <div role="alert">
      {toastData && toastData.isError ? (
        <div className="error message">{toastData.msg}</div>
      ) : (
        toastData && <div className="message">{toastData.msg}</div>
      )}
    </div>
  );

  return (
    <>
      <h1>Bloglist</h1>
      {user === null ? (
        <div>
          <LoginForm onLogin={handleLogin}>{toastMessage}</LoginForm>
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
          <Togglable openLabel="New blog" closeLabel="Cancel" key={blogFormKey}>
            <BlogForm onCreate={handleCreateBlog} />
          </Togglable>
          <ul className="bloglist">
            {[...blogs].sort(sortByLikesDesc).map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                user={user}
                onLike={handleLikeBlog}
                onRemove={handleRemoveBlog}
              />
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default App;
