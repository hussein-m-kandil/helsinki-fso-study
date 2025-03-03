import PropTypes from 'prop-types';

const Blog = ({ blog }) => (
  <li>
    {blog.title} {blog.author}
  </li>
);

Blog.propTypes = {
  blog: PropTypes.shape({
    author: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default Blog;
