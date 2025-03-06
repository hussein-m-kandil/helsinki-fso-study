import PropTypes from 'prop-types';
import { useState } from 'react';

function BlogForm({ onCreate }) {
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const hasEmptyField = () => !author || !title || !url;

  const resetForm = () => {
    setAuthor('');
    setTitle('');
    setUrl('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({ author, title, url }, resetForm);
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

BlogForm.propTypes = { onCreate: PropTypes.func.isRequired };

export default BlogForm;
