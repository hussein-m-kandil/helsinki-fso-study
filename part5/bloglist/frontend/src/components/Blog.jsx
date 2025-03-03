import PropTypes from 'prop-types';
import { useState } from 'react';

function Blog({ blog, user, onLike, onDelete }) {
  const [visible, setVisible] = useState(false);

  const handleTogglingVisibility = () => setVisible(!visible);

  const handleLike = (e) => {
    e.target.disabled = true;
    onLike(blog);
  };

  const handleDelete = (e) => {
    e.target.disabled = true;
    onDelete(blog);
  };

  return (
    <li className="blog">
      <h3>
        <span>{blog.title}</span>
        <em className="fw-normal"> - {blog.author}</em>
        <button type="button" onClick={handleTogglingVisibility}>
          {visible ? 'Hide' : 'Show'}
        </button>
      </h3>
      {visible && (
        <>
          <p>{blog.url}</p>
          <p key={blog.likes}>
            Likes <strong>{blog.likes}</strong>{' '}
            <button type="button" onClick={handleLike}>
              Like
            </button>
          </p>
          <h4 key={new Date().valueOf()}>
            Added by <em>{blog.user.name}</em>
            {user.username === blog.user.username && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
              >
                Delete
              </button>
            )}
          </h4>
        </>
      )}
    </li>
  );
}

Blog.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
    user: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
  }).isRequired,
  onLike: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default Blog;
