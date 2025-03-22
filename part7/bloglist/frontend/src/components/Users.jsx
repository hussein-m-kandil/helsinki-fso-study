import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Users = () => {
  const users = useSelector(({ users }) => users);

  return (
    <>
      <h2 id="users-label">Users</h2>
      <table
        aria-labelledby="users-label"
        style={{ width: '100%', textAlign: 'left' }}
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Created Blogs</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>
                <Link to={`./${u.id}`}>{u.name}</Link>
              </td>
              <td>{u.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Users;
