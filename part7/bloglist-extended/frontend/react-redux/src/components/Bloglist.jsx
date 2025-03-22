import { useSelector } from 'react-redux';
import BlogLinks from './BlogLinks.jsx';
import Loading from './Loading.jsx';

function Bloglist() {
  const blogs = useSelector(({ blogs }) => blogs);

  return !blogs.length ? (
    <Loading />
  ) : (
    <BlogLinks label={'Blogs'} blogs={blogs} />
  );
}

export default Bloglist;
