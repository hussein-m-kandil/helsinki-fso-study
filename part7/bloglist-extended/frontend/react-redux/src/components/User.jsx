import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import Loading from './Loading.jsx';
import BlogLinks from './BlogLinks.jsx';

const User = () => {
  const { id } = useParams();

  const user = useSelector(({ users }) => users).find((u) => u.id === id);

  return !user ? (
    <Loading />
  ) : (
    <BlogLinks
      label={`${user.name[0].toUpperCase()}${
        user.name.length > 1 ? user.name.slice(1).toLowerCase() : ''
      } Blogs`}
      blogs={user.blogs}
    />
  );
};

export default User;
