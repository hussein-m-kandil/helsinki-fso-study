import { useDispatch, useSelector } from 'react-redux';
import { commentOnBlog, likeBlog, removeBlog } from '../reducers/blogsReducer';
import PropTypes from 'prop-types';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Loading from './Loading';

function Blog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const blog = useSelector(({ blogs }) => blogs).find((b) => b.id === id);
  const user = useSelector(({ auth }) => auth);
  const dispatch = useDispatch();

  const handleLike = (e) => {
    e.target.disabled = true;
    dispatch(likeBlog(blog));
  };

  const handleRemove = (e) => {
    if (confirm(`Remove blog "${blog.title} by ${blog.author}"?`)) {
      e.target.disabled = true;
      dispatch(removeBlog(blog, () => navigate('/')));
    }
  };

  const handleComment = (e) => {
    e.preventDefault();
    const { comment, submitter } = e.target;
    submitter.disabled = true;
    const handleSuccess = () => {
      submitter.disabled = false;
      comment.value = '';
      comment.focus();
    };
    dispatch(commentOnBlog(comment.value, blog, handleSuccess));
  };

  if (!blog) return <Loading />;

  return (
    <>
      <h2>
        {blog.title} by <em>{blog.author}</em>
      </h2>
      <a href={blog.url}>{blog.url}</a>
      <p key={blog.likes}>
        Likes <strong>{blog.likes}</strong>{' '}
        <button type="button" onClick={handleLike}>
          Like
        </button>
      </p>
      <h4 key={new Date().valueOf()}>
        Added by{' '}
        <Link to={`/users/${blog.user.id}`}>
          <em>{blog.user.name}</em>
        </Link>
        {user.username === blog.user.username && (
          <>
            &nbsp;
            <button type="button" className="btn-danger" onClick={handleRemove}>
              Remove
            </button>
          </>
        )}
      </h4>
      <h3>Comments</h3>
      <form
        onSubmit={handleComment}
        onChange={(e) => {
          const { comment, submitter } = e.currentTarget;
          submitter.disabled = !comment.value;
        }}
      >
        <input
          type="text"
          name="comment"
          autoComplete="on"
          placeholder="New comment..."
        />
        &nbsp;
        <button type="submit" name="submitter" disabled={true}>
          Comment
        </button>
      </form>
      {blog.comments.length ? (
        <ul>
          {blog.comments.map(({ id, comment }) => (
            <li key={id}>{comment}</li>
          ))}
        </ul>
      ) : (
        <p style={{ textAlign: 'center' }}>
          There are no comments on this blog!
        </p>
      )}
    </>
  );
}

Blog.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
    comments: PropTypes.arrayOf(PropTypes.shape({ comment: PropTypes.string }))
      .isRequired,
    user: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Blog;
