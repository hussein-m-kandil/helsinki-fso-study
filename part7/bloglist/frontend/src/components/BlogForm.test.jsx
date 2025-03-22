import '@testing-library/jest-dom/vitest';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogForm from './BlogForm.jsx';

import * as blogsReducer from '../reducers/blogsReducer.js';
import { Provider } from 'react-redux';
import store from '../store.js';

const WrappedBlogForm = (props) => {
  return (
    <Provider store={store}>
      <BlogForm {...props} />
    </Provider>
  );
};

const createBlogSpy = vi.spyOn(blogsReducer, 'createBlog');

vi.mock('../services/blog.js', () => {
  const asyncFn = () => Promise.resolve({});
  return {
    default: {
      getAll: asyncFn,
      delete: asyncFn,
      post: asyncFn,
      put: asyncFn,
    },
  };
});

describe('<BlogForm />', () => {
  it('should disable the submission while it has an empty field', async () => {
    const user = userEvent.setup();
    render(<WrappedBlogForm />);
    const inputs = screen.getAllByRole('textbox');
    for (const input of inputs) {
      expect(screen.getByRole('button', { name: /create/i })).toBeDisabled();
      await user.type(input, 'Blah blah ...');
    }
    expect(screen.getByRole('button', { name: /create/i })).not.toBeDisabled();
  });

  it('should call `createBlog` with the user inputs on submit', async () => {
    const newBlogMock = {
      url: 'https://nowhere.com',
      title: 'Nowhere Plans',
      author: 'Nowhere Man',
    };
    const user = userEvent.setup();
    render(<WrappedBlogForm />);
    for (const [k, v] of Object.entries(newBlogMock)) {
      const inp = screen.getByRole('textbox', { name: new RegExp(k, 'i') });
      await user.type(inp, v);
    }
    await user.click(screen.getByRole('button', { name: /create/i }));
    expect(createBlogSpy).toHaveBeenCalledOnce();
    expect(createBlogSpy.mock.calls[0][0]).toStrictEqual(newBlogMock);
  });

  it('should call `onBlogCreated`', async () => {
    const handleBlogCreatedMock = vi.fn();
    const newBlogMock = {
      url: 'https://nowhere.com',
      title: 'Nowhere Plans',
      author: 'Nowhere Man',
    };
    const user = userEvent.setup();
    render(<WrappedBlogForm onBlogCreated={handleBlogCreatedMock} />);
    for (const [k, v] of Object.entries(newBlogMock)) {
      const inp = screen.getByRole('textbox', { name: new RegExp(k, 'i') });
      await user.type(inp, v);
    }
    await user.click(screen.getByRole('button', { name: /create/i }));
    expect(handleBlogCreatedMock).toHaveBeenCalledOnce();
  });
});
