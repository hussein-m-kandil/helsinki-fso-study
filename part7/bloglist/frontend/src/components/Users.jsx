import { useSelector } from 'react-redux';
import {
  Link,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import { useLocation } from 'react-router-dom';

const Users = () => {
  const users = useSelector(({ users }) => users);

  const location = useLocation();

  return (
    <>
      <h2 id="users-label" className="text-xl font-bold text-center my-4">
        Users
      </h2>
      <Table
        removeWrapper
        aria-labelledby="users-label"
        classNames={{
          tbody: 'divide-gray-200 divide-y-1',
          td: 'px-4',
          th: 'px-4',
        }}
      >
        <TableHeader>
          <TableColumn>Name</TableColumn>
          <TableColumn align="end">Count of Blogs</TableColumn>
        </TableHeader>
        <TableBody emptyContent={'No users found'} items={users}>
          {(u) => (
            <TableRow key={u.key}>
              <TableCell>
                <Link href={`${location.pathname}/${u.id}`}>{u.name}</Link>
              </TableCell>
              <TableCell>{u.blogs.length}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default Users;
