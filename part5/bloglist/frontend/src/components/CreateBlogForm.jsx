import PropTypes from 'prop-types';
import { useState } from 'react';

function CreateBlogForm({ onCreate }) {
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

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
        <button type="submit">Create new blog</button>
      </p>
    </form>
  );
}

CreateBlogForm.propTypes = { onCreate: PropTypes.func.isRequired };

export default CreateBlogForm;
