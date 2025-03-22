import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ErrorMessage from './ErrorMessage.jsx';
import userService from '../services/user.js';
import BlogLinks from './BlogLinks.jsx';
import Loading from './Loading.jsx';

const User = () => {
  const { id } = useParams();

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getOne(id),
  });

  if (isLoading) return <Loading />;

  if (isError)
    return <ErrorMessage message={'Sorry, could not load user data!'} />;

  return (
    <BlogLinks
      label={`${user.name[0].toUpperCase()}${
        user.name.length > 1 ? user.name.slice(1).toLowerCase() : ''
      } Blogs`}
      blogs={user.blogs}
    />
  );
};

export default User;
