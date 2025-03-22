import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Input } from '@heroui/react';
import { AuthContext } from '../contexts/authContext.js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { NotificationContext } from '../contexts/notificationContext';
import { useServerErrorHandler } from '../hooks/useServerErrorHandler.js';
import blogService from '../services/blog.js';

function BlogForm() {
  const navigate = useNavigate();

  const [disabled, setDisabled] = useState(false);
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const { showNotification } = useContext(NotificationContext);
  const { user } = useContext(AuthContext);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ blog, token }) => blogService.post(blog, token),
  });

  const handleServerError = useServerErrorHandler();

  const hasEmptyField = () => !author || !title || !url;

  const handleSubmit = (e) => {
    e.preventDefault();
    setDisabled(true);
    mutation.mutate(
      { blog: { author, title, url }, token: user?.token },
      {
        onSuccess: (newBlog) => {
          queryClient.invalidateQueries({ queryKey: ['blogs'] });
          showNotification(`${newBlog.title} blog created!`);
          navigate('/');
        },
        onError: (error) => {
          handleServerError(error, 'Failed to create a blog');
          setDisabled(false);
        },
      }
    );
  };

  return (
    <Form
      onSubmit={handleSubmit}
      className="w-full max-w-xs flex flex-col gap-4 mx-auto mt-8"
    >
      <h3 className="font-bold text-lg text-center w-full">Create New Blog</h3>
      <Input
        placeholder="Enter author name"
        labelPlacement="outside"
        isDisabled={disabled}
        autoComplete="on"
        value={author}
        label="Author"
        type="text"
        id="author"
        isRequired
        onChange={(e) => setAuthor(e.target.value)}
      />
      <Input
        placeholder="Enter blog title"
        labelPlacement="outside"
        isDisabled={disabled}
        autoComplete="on"
        value={title}
        label="Title"
        type="text"
        id="title"
        isRequired
        onChange={(e) => setTitle(e.target.value)}
      />
      <Input
        placeholder="Enter blog URL"
        labelPlacement="outside"
        isDisabled={disabled}
        autoComplete="on"
        value={url}
        label="Url"
        type="text"
        id="url"
        isRequired
        onChange={(e) => setUrl(e.target.value)}
      />
      <p>
        <Button
          type="submit"
          color="primary"
          isDisabled={hasEmptyField() || disabled}
        >
          Create
        </Button>
      </p>
    </Form>
  );
}

export default BlogForm;
