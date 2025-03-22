import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createBlog } from '../reducers/blogsReducer.js';
import { Form, Button, Input } from '@heroui/react';
import { useNavigate } from 'react-router-dom';

function BlogForm() {
  const [disabled, setDisabled] = useState(false);
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const hasEmptyField = () => !author || !title || !url;

  const handleSubmit = (e) => {
    e.preventDefault();
    setDisabled(true);
    const handleSuccess = () => navigate('/');
    const handleError = () => setDisabled(false);
    dispatch(createBlog({ author, title, url }, handleSuccess, handleError));
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
