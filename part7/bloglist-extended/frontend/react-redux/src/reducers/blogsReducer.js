import { createSlice } from '@reduxjs/toolkit';
import blogService from '../services/blog.js';
import { showNotification } from './notificationReducer';
import { logout } from './authReducer.js';

export const { reducer: blogsReducer, actions: blogsActions } = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setAll(state, action) {
      const allBlogs = action.payload;
      return allBlogs;
    },
    appendOne(state, action) {
      const newBlog = action.payload;
      return [...state, newBlog];
    },
    removeOne(state, action) {
      const blogId = action.payload;
      return state.filter(({ id }) => id !== blogId);
    },
    updateOne(state, action) {
      const updatedBlog = action.payload;
      const blogIndex = state.findIndex(({ id }) => id === updatedBlog.id);
      if (blogIndex < 0) return state;
      return [
        ...state.slice(0, blogIndex),
        updatedBlog,
        ...state.slice(blogIndex + 1),
      ];
    },
  },
});

const handleError = (error, dispatch, defaultMessage) => {
  console.log(error.toString?.() || error);
  const errMsg = error.response?.data?.error || defaultMessage;
  dispatch(showNotification(errMsg, true));
  if (error.response?.status === 401) dispatch(logout());
};

export const createBlog = (newBlog, onSuccess, onError) => {
  return async (dispatch, getState) => {
    try {
      const user = getState().auth;
      const createdBlog = await blogService.post(newBlog, user?.token);
      dispatch(blogsActions.appendOne(createdBlog));
      dispatch(showNotification(`${newBlog.title} blog created!`));
      onSuccess?.();
    } catch (error) {
      handleError(error, dispatch, 'Failed to create a blog');
      onError?.();
    }
  };
};

export const likeBlog = (blog, onSuccess) => async (dispatch, getState) => {
  try {
    const user = getState().auth;
    const likedBlog = { ...blog, likes: blog.likes + 1 };
    const updatedBlog = await blogService.put(likedBlog, user?.token);
    dispatch(blogsActions.updateOne(updatedBlog));
    dispatch(showNotification(`${blog.title} blog liked!`));
    onSuccess?.();
  } catch (error) {
    handleError(error, dispatch, `Failed to like "${blog.title}"`);
  }
};

export const removeBlog = (blog, onSuccess) => async (dispatch, getState) => {
  try {
    const user = getState().auth;
    await blogService.delete(blog, user?.token);
    dispatch(blogsActions.removeOne(blog.id));
    dispatch(showNotification(`${blog.title} blog deleted!`));
    onSuccess?.();
  } catch (error) {
    handleError(error, dispatch, `Failed to delete "${blog.title}"`);
  }
};

export const commentOnBlog = (comment, blog, onSuccess, onError) => {
  return async (dispatch, getState) => {
    try {
      const user = getState().auth;
      const commentedBlog = await blogService.comment(
        comment,
        blog,
        user?.token
      );
      dispatch(blogsActions.updateOne(commentedBlog));
      dispatch(showNotification(`${blog.title} blog got a new comment!`));
      onSuccess?.();
    } catch (error) {
      handleError(error, dispatch, `Failed to comment on "${blog.title}"`);
      onError?.();
    }
  };
};

export default blogsReducer;
