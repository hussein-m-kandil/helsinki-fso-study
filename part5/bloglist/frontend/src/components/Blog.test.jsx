import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Blog from './Blog.jsx';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';

const toRegex = (strRegex) => new RegExp(strRegex, 'i');

const blogMock = {
  title: 'Nowhere Plans',
  author: 'Nowhere Man',
  url: 'https://nowhere.com',
  likes: 0,
  user: { username: 'Superman', name: 'superman' },
};

const handleLikeMock = vi.fn();
const handleRemoveMock = vi.fn();

const windowConfirmFnSpy = vi.spyOn(window, 'confirm');

afterEach(() => vi.resetAllMocks());

describe('<Blog />', () => {
  it('should only render title and author with a button to show details', () => {
    render(<Blog blog={blogMock} user={blogMock.user} />);
    expect(screen.getByText(toRegex(blogMock.title))).toBeInTheDocument();
    expect(screen.getByText(toRegex(blogMock.author))).toBeInTheDocument();
    expect(screen.queryByText(toRegex(blogMock.likes))).toBeNull();
    expect(screen.queryByText(toRegex(blogMock.url))).toBeNull();
  });

  it('should show details after clicking the show button', async () => {
    const user = userEvent.setup();
    render(<Blog blog={blogMock} user={blogMock.user} />);
    await user.click(screen.getByRole('button', { name: toRegex('show') }));
    expect(screen.getByText(toRegex(blogMock.title))).toBeInTheDocument();
    expect(screen.getByText(toRegex(blogMock.author))).toBeInTheDocument();
    expect(screen.getByText(toRegex(blogMock.likes))).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: toRegex('like') })
    ).toBeInTheDocument();
    expect(screen.getByText(toRegex(blogMock.url))).toBeInTheDocument();
    expect(
      screen.getByText(
        toRegex(`(${blogMock.user.name})|(${blogMock.user.username})`)
      )
    ).toBeInTheDocument();
  });

  it('should disable `like` button on click and call `onLike` callback', async () => {
    const user = userEvent.setup();
    render(
      <Blog blog={blogMock} user={blogMock.user} onLike={handleLikeMock} />
    );
    await user.click(screen.getByRole('button', { name: toRegex('show') }));
    const likeBtn = screen.getByRole('button', { name: toRegex('like') });
    await user.click(likeBtn);
    expect(likeBtn).toBeDisabled();
    expect(handleLikeMock).toHaveBeenCalledOnce();
  });

  it('should call `onLike` twice if the `Like` button clicked twice', async () => {
    const BlogParent = () => {
      const [blog, setBlog] = useState(blogMock);
      handleLikeMock.mockImplementation((blog) => {
        setBlog({ ...blog, likes: blog.likes + 1 });
      });
      return <Blog blog={blog} user={blogMock.user} onLike={handleLikeMock} />;
    };
    const user = userEvent.setup();
    render(<BlogParent />);
    await user.click(screen.getByRole('button', { name: toRegex('show') }));
    await user.click(screen.getByRole('button', { name: toRegex('like') }));
    await user.click(screen.getByRole('button', { name: toRegex('like') }));
    expect(handleLikeMock).toHaveBeenCalledTimes(2);
  });

  it('should show `remove` button if the given user is the blog creator', async () => {
    const user = userEvent.setup();
    render(<Blog blog={blogMock} user={blogMock.user} />);
    await user.click(screen.getByRole('button', { name: toRegex('show') }));
    expect(
      screen.getByRole('button', { name: toRegex('remove') })
    ).toBeInTheDocument();
  });

  it('should NOT show `remove` button if the given user is NOT the blog creator', async () => {
    const user = userEvent.setup();
    render(
      <Blog blog={blogMock} user={{ username: 'batman', name: 'Batman' }} />
    );
    await user.click(screen.getByRole('button', { name: toRegex('show') }));
    expect(
      screen.queryByRole('button', { name: toRegex('remove') })
    ).toBeNull();
  });

  it('should call `onRemove` when the `remove` button clicked and the user confirm', async () => {
    windowConfirmFnSpy.mockImplementationOnce(() => true);
    const user = userEvent.setup();
    render(
      <Blog blog={blogMock} user={blogMock.user} onRemove={handleRemoveMock} />
    );
    await user.click(screen.getByRole('button', { name: toRegex('show') }));
    const removeBtn = screen.getByRole('button', { name: toRegex('remove') });
    await user.click(removeBtn);
    expect(windowConfirmFnSpy).toHaveBeenCalledOnce();
    expect(handleRemoveMock).toHaveBeenCalledOnce();
  });

  it('should NOT call `onRemove` when the `remove` button clicked and the user cancel', async () => {
    windowConfirmFnSpy.mockImplementationOnce(() => false);
    const user = userEvent.setup();
    render(
      <Blog blog={blogMock} user={blogMock.user} onRemove={handleRemoveMock} />
    );
    await user.click(screen.getByRole('button', { name: toRegex('show') }));
    const removeBtn = screen.getByRole('button', { name: toRegex('remove') });
    await user.click(removeBtn);
    expect(windowConfirmFnSpy).toHaveBeenCalledOnce();
    expect(handleRemoveMock).not.toHaveBeenCalled();
  });

  it('should NOT call `onRemove` when the `remove` button clicked and the user escape', async () => {
    windowConfirmFnSpy.mockImplementationOnce(() => null);
    const user = userEvent.setup();
    render(
      <Blog blog={blogMock} user={blogMock.user} onRemove={handleRemoveMock} />
    );
    await user.click(screen.getByRole('button', { name: toRegex('show') }));
    const removeBtn = screen.getByRole('button', { name: toRegex('remove') });
    await user.click(removeBtn);
    expect(windowConfirmFnSpy).toHaveBeenCalledOnce();
    expect(handleRemoveMock).not.toHaveBeenCalled();
  });
});
