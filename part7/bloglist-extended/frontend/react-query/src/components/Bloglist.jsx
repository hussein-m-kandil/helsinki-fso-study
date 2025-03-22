import { useQuery } from '@tanstack/react-query';
import blogService from '../services/blog.js';
import BlogLinks from './BlogLinks.jsx';
import Loading from './Loading.jsx';
import ErrorMessage from './ErrorMessage.jsx';

function Bloglist() {
  const {
    data: blogs,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  });

  if (isLoading) return <Loading />;

  if (isError)
    return <ErrorMessage message={'Sorry, we could not fetch any blogs!'} />;

  if (!blogs.length) return <div>There are no blogs, yet!</div>;

  return <BlogLinks label={'Blogs'} blogs={blogs} />;
}

export default Bloglist;
