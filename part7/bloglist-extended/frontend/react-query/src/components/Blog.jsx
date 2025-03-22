import { useContext, useState } from 'react';
import { AuthContext } from '../contexts/authContext';
import { useNavigate, useParams } from 'react-router-dom';
import { NotificationContext } from '../contexts/notificationContext.js';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Card,
  CardBody,
  Form,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalContent,
  useDisclosure,
} from '@heroui/react';
import PropTypes from 'prop-types';
import Loading from './Loading.jsx';
import blogService from '../services/blog.js';
import useServerErrorHandler from '../hooks/useServerErrorHandler.js';
import ErrorMessage from './ErrorMessage.jsx';

function Blog() {
  const [comment, setComment] = useState('');

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { showNotification } = useContext(NotificationContext);
  const { user } = useContext(AuthContext);

  const token = user?.token;

  const navigate = useNavigate();
  const { id } = useParams();

  const {
    data: blog,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['blog', id],
    queryFn: () => blogService.getOne(id),
  });

  const queryClient = useQueryClient();
  const commentBlogMutation = useMutation({
    mutationFn: ({ comment, blogToComment }) =>
      blogService.comment(comment, blogToComment, token),
  });
  const likeBlogMutation = useMutation({
    mutationFn: (likedBlog) => blogService.put(likedBlog, token),
  });
  const removeBlogMutation = useMutation({
    mutationFn: (blogToDelete) => blogService.delete(blogToDelete, token),
  });

  const disabled =
    commentBlogMutation.isPending ||
    likeBlogMutation.isPending ||
    removeBlogMutation.isPending;

  const handleServerError = useServerErrorHandler();

  const getBlogUpdateHandler = (notificationMessage) => {
    return (updatedBlog) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.setQueryData(['blog', id], updatedBlog);
      showNotification(notificationMessage);
    };
  };

  const handleComment = (e) => {
    e.preventDefault();
    commentBlogMutation.mutate(
      { blogToComment: blog, comment: e.target.comment.value },
      {
        onSuccess: getBlogUpdateHandler(
          `${blog.title} blog got a new comment!`
        ),
        onError: (error) =>
          handleServerError(error, `Failed to comment on "${blog.title}"`),
        onSettled: () => {
          setComment('');
          e.target.comment.focus();
        },
      }
    );
  };

  const handleLike = () => {
    likeBlogMutation.mutate(
      { ...blog, likes: blog.likes + 1 },
      {
        onSuccess: getBlogUpdateHandler(`${blog.title} blog liked!`),
        onError: (error) =>
          handleServerError(error, `Failed to like "${blog.title}"`),
      }
    );
  };

  const handleRemove = () => {
    removeBlogMutation.mutate(blog, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['blogs'] });
        showNotification(`${blog.title} blog deleted!`);
        navigate('/');
      },
      onError: (error) =>
        handleServerError(error, `Failed to delete "${blog.title}"`),
    });
  };

  if (isLoading) return <Loading />;

  if (isError)
    return <ErrorMessage message={'Sorry, could not load blog data!'} />;

  return (
    <div className="text-center">
      <h2 className="my-6 flex justify-center gap-0.5 items-center">
        <span className="font-bold text-xl">
          {blog.title} by <em>{blog.author}</em>
        </span>
        &nbsp;
        <span key={blog.likes}>
          ({blog.likes} {blog.likes === 1 ? 'like' : 'likes'})
        </span>
        &nbsp;
        <Button
          size="sm"
          type="button"
          color="success"
          variant="ghost"
          isDisabled={disabled}
          className="font-semibold"
          onPress={handleLike}
        >
          Like
        </Button>
        &nbsp;
        {user.username === blog.user.username && (
          <Button
            size="sm"
            type="button"
            color="danger"
            variant="ghost"
            onPress={onOpen}
            isDisabled={disabled}
          >
            Remove
          </Button>
        )}
      </h2>
      <p>
        <Link href={blog.url}>{blog.url}</Link>
      </p>
      <h4 key={Date.now()} className="font-semibold my-2 text-xs">
        Added by{' '}
        <Link href={`/users/${blog.user.id}`} className="text-xs">
          <em>{blog.user.name}</em>
        </Link>
      </h4>
      <h3 id="comments-label" className="mt-6 mb-4 font-semibold text-lg">
        Comments
      </h3>
      <Form onSubmit={handleComment} className="flex-row my-4">
        <Input
          type="text"
          name="comment"
          value={comment}
          autoComplete="on"
          placeholder="New comment..."
          onChange={(e) => setComment(e.target.value)}
        />
        &nbsp;
        <Button
          type="submit"
          color="primary"
          name="submitter"
          isDisabled={!comment || disabled}
        >
          Comment
        </Button>
      </Form>
      {blog.comments.length ? (
        <ul className="space-y-2">
          {blog.comments.map(({ id, comment }) => (
            <li key={id}>
              <Card shadow="sm">
                <CardBody className="font-semibold text-xs">{comment}</CardBody>
              </Card>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center">There are no comments on this blog!</p>
      )}
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        placement="top-center"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 font-bold text-lg">
                Remove Blog
              </ModalHeader>
              <ModalBody className="font-semibold text-sm">
                <div>
                  Do you really want to remove the{' '}
                  <span className="font-extrabold italic">{blog.title}</span>{' '}
                  blog?
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  className="font-semibold"
                  variant="flat"
                  onPress={onClose}
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  className="font-semibold"
                  onPress={() => {
                    onClose();
                    handleRemove();
                  }}
                >
                  Remove
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

Blog.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
    comments: PropTypes.arrayOf(PropTypes.shape({ comment: PropTypes.string }))
      .isRequired,
    user: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Blog;
