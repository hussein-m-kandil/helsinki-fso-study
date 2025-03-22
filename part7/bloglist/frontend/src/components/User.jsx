import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import Loading from './Loading.jsx';

const User = () => {
  const { id } = useParams();

  const user = useSelector(({ users }) => users).find((u) => u.id === id);

  if (!user) return <Loading />;

  return (
    <>
      <h2 id="user-label">{user.name}</h2>
      <h3 id="user-blogs-label">Created Blogs</h3>
      <ul aria-labelledby="user-blogs-label">
        {user.blogs.map((b) => (
          <li key={b.id}>
            <Link to={`/blogs/${b.id}`}>{b.title}</Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default User;
