import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import Blog from './Blog.jsx';

import * as blogsReducer from '../reducers/blogsReducer.js';
import { authActions } from '../reducers/authReducer.js';
import { Provider } from 'react-redux';
import store from '../store.js';
import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';

const blogMock = {
  id: '1',
  likes: 0,
  comments: [],
  title: 'Nowhere Plans',
  author: 'Nowhere Man',
  url: 'https://nowhere.com',
  user: { username: 'Superman', name: 'superman' },
};

beforeEach(() => {
  const state = store.getState();
  if (!state.auth) {
    store.dispatch(authActions.login(blogMock.user));
  }
  if (!state.blogs.length) {
    store.dispatch(blogsReducer.blogsActions.appendOne(blogMock));
  }
});

const WrappedBlog = () => {
  return (
    <Provider store={store}>
      <Router initialEntries={[`/blogs/${blogMock.id}`]} initialIndex={0}>
        <Routes>
          <Route path="/blogs/:id" element={<Blog />} />
        </Routes>
      </Router>
    </Provider>
  );
};

const toRegex = (strRegex) => new RegExp(strRegex, 'i');

const likeBlogSpy = vi.spyOn(blogsReducer, 'likeBlog');
const removeBlogSpy = vi.spyOn(blogsReducer, 'removeBlog');

vi.mock('../services/blog.js', () => {
  const asyncFn = (blog) => Promise.resolve(blog);
  return {
    default: {
      getAll: asyncFn,
      delete: asyncFn,
      post: asyncFn,
      put: asyncFn,
    },
  };
});

const windowConfirmFnSpy = vi.spyOn(window, 'confirm');

afterEach(() => vi.resetAllMocks());

describe('<Blog />', () => {
  it('should only render title and author with a button to show details', () => {
    render(<WrappedBlog />);
    expect(screen.getByText(toRegex(blogMock.title))).toBeInTheDocument();
    expect(screen.getByText(toRegex(blogMock.author))).toBeInTheDocument();
    expect(screen.queryByText(toRegex(blogMock.likes))).toBeInTheDocument();
    expect(screen.queryByText(toRegex(blogMock.url))).toBeInTheDocument();
  });

  it('should disable `like` button on click and call `onLike` callback', async () => {
    const user = userEvent.setup();
    render(<WrappedBlog />);
    const likeBtn = screen.getByRole('button', { name: toRegex('like') });
    await user.click(likeBtn);
    expect(likeBtn).toBeDisabled();
    expect(likeBlogSpy).toHaveBeenCalledOnce();
  });

  it('should call `likeBlog`', async () => {
    const user = userEvent.setup();
    render(<WrappedBlog />);
    await user.click(screen.getByRole('button', { name: toRegex('like') }));
    expect(likeBlogSpy).toHaveBeenCalledOnce();
  });

  it('should show `remove` button if the given user is the blog creator', async () => {
    render(<WrappedBlog />);
    expect(
      screen.getByRole('button', { name: toRegex('remove') })
    ).toBeInTheDocument();
  });

  it('should NOT show `remove` button if the given user is NOT the blog creator', async () => {
    store.dispatch(authActions.logout());
    store.dispatch(authActions.login({ username: 'batman', name: 'Batman' }));
    render(<WrappedBlog />);
    expect(
      screen.queryByRole('button', { name: toRegex('remove') })
    ).toBeNull();
    store.dispatch(authActions.logout());
    store.dispatch(authActions.login(blogMock.user));
  });

  it('should call `removeBlog` when the `remove` button clicked and the user confirm', async () => {
    windowConfirmFnSpy.mockImplementationOnce(() => true);
    const user = userEvent.setup();
    render(<WrappedBlog />);
    const removeBtn = screen.getByRole('button', { name: toRegex('remove') });
    await user.click(removeBtn);
    expect(windowConfirmFnSpy).toHaveBeenCalledOnce();
    expect(removeBlogSpy).toHaveBeenCalledOnce();
  });

  it('should NOT call `removeBlog` when the `remove` button clicked and the user cancel', async () => {
    windowConfirmFnSpy.mockImplementationOnce(() => false);
    const user = userEvent.setup();
    render(<WrappedBlog />);
    const removeBtn = screen.getByRole('button', { name: toRegex('remove') });
    await user.click(removeBtn);
    expect(windowConfirmFnSpy).toHaveBeenCalledOnce();
    expect(removeBlogSpy).not.toHaveBeenCalled();
  });

  it('should NOT call `removeBlog` when the `remove` button clicked and the user escape', async () => {
    windowConfirmFnSpy.mockImplementationOnce(() => null);
    const user = userEvent.setup();
    render(<WrappedBlog />);
    const removeBtn = screen.getByRole('button', { name: toRegex('remove') });
    await user.click(removeBtn);
    expect(windowConfirmFnSpy).toHaveBeenCalledOnce();
    expect(removeBlogSpy).not.toHaveBeenCalled();
  });
});
