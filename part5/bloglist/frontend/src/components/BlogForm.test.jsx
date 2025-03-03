import '@testing-library/jest-dom/vitest';
import BlogForm from './BlogForm.jsx';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('<BlogForm />', () => {
  it('should disable the submission while it has an empty field', async () => {
    const user = userEvent.setup();
    render(<BlogForm />);
    const inputs = screen.getAllByRole('textbox');
    for (const input of inputs) {
      expect(screen.getByRole('button', { name: /create/i })).toBeDisabled();
      await user.type(input, 'Blah blah ...');
    }
    expect(screen.getByRole('button', { name: /create/i })).not.toBeDisabled();
  });

  it('should call `onCreate` with the user inputs on submit', async () => {
    const handleCreateMock = vi.fn();
    const newBlogMock = {
      url: 'https://nowhere.com',
      title: 'Nowhere Plans',
      author: 'Nowhere Man',
    };
    const user = userEvent.setup();
    render(<BlogForm onCreate={handleCreateMock} />);
    for (const [k, v] of Object.entries(newBlogMock)) {
      const inp = screen.getByRole('textbox', { name: new RegExp(k, 'i') });
      await user.type(inp, v);
    }
    await user.click(screen.getByRole('button', { name: /create/i }));
    expect(handleCreateMock).toHaveBeenCalledOnce();
    expect(handleCreateMock.mock.calls[0][0]).toStrictEqual(newBlogMock);
  });
});
