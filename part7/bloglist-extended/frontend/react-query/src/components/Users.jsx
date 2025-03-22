import {
  Link,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import userService from '../services/user.js';
import Loading from './Loading.jsx';
import ErrorMessage from './ErrorMessage.jsx';

const Users = () => {
  const location = useLocation();

  const {
    data: users,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
  });

  if (isLoading) return <Loading />;

  if (isError)
    return <ErrorMessage message={'Sorry, we could not fetch any blogs!'} />;

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
        <TableBody emptyContent={'There are no blogs, yet!'} items={users}>
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
