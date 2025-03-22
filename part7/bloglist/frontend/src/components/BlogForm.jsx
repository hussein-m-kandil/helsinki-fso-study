import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createBlog } from '../reducers/blogsReducer.js';
import PropTypes from 'prop-types';

function BlogForm({ onBlogCreated = () => {} }) {
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const dispatch = useDispatch();

  const hasEmptyField = () => !author || !title || !url;

  const resetForm = () => {
    onBlogCreated();
    setAuthor('');
    setTitle('');
    setUrl('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createBlog({ author, title, url }, resetForm));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create New Blog</h3>
      <p>
        <label htmlFor="author">Author: </label>
        <input
          type="text"
          id="author"
          autoComplete="on"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
      </p>
      <p>
        <label htmlFor="title">Title: </label>
        <input
          type="text"
          id="title"
          autoComplete="on"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </p>
      <p>
        <label htmlFor="url">Url: </label>
        <input
          type="text"
          id="url"
          autoComplete="on"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </p>
      <p>
        <button type="submit" disabled={hasEmptyField()}>
          Create
        </button>
      </p>
    </form>
  );
}

BlogForm.propTypes = { onBlogCreated: PropTypes.func };

export default BlogForm;
