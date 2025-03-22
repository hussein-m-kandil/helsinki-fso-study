import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import Togglable from './Togglable.jsx';
import BlogForm from './BlogForm.jsx';
import Blog from './Blog.jsx';
import { Link } from 'react-router-dom';
import Loading from './Loading.jsx';

function Bloglist() {
  const [blogFormKey, setBlogFormKey] = useState(Date.now());

  const blogs = useSelector(({ blogs }) => blogs);

  const sortedBlogs = useMemo(() => {
    const sortByLikesDesc = (blogA, blogB) => blogB.likes - blogA.likes;
    return [...blogs].sort(sortByLikesDesc);
  }, [blogs]);

  if (!blogs.length) return <Loading />;

  return (
    <>
      <h2 id="bloglist-label">Blogs</h2>
      <Togglable openLabel="New blog" closeLabel="Cancel" key={blogFormKey}>
        <BlogForm onBlogCreated={() => setBlogFormKey(Date.now())} />
      </Togglable>
      <ul className="bloglist" aria-labelledby="bloglist-label">
        {sortedBlogs.map((b) => (
          <li key={b.id} className="blog">
            <Link to={`/blogs/${b.id}`}>{b.title}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export default Bloglist;
