import { useMemo } from 'react';
import LinkList from './LinkList';
import PropTypes from 'prop-types';

const sortByLikesDesc = (blogA, blogB) => blogB.likes - blogA.likes;

const BlogLinks = ({ label, blogs }) => {
  const sortedBlogItems = useMemo(() => {
    return blogs
      .map((blog) => ({
        ...blog,
        key: blog.id,
        linkText: blog.title,
        linkHref: `/blogs/${blog.id}`,
      }))
      .sort(sortByLikesDesc);
  }, [blogs]);

  return <LinkList label={label} items={sortedBlogItems} />;
};

BlogLinks.propTypes = {
  label: PropTypes.string.isRequired,
  blogs: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      likes: PropTypes.number.isRequired,
      url: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default BlogLinks;
