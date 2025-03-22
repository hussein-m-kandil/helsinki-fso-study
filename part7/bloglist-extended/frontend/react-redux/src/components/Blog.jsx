import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
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
import { commentOnBlog, likeBlog, removeBlog } from '../reducers/blogsReducer';
import PropTypes from 'prop-types';
import Loading from './Loading';

function Blog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [comment, setComment] = useState('');
  const [commentDisabled, setCommentDisabled] = useState(false);
  const [removeDisabled, setRemoveDisabled] = useState(false);
  const [likeDisabled, setLikeDisabled] = useState(false);

  const disabled = likeDisabled || removeDisabled || commentDisabled;

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const blog = useSelector(({ blogs }) => blogs).find((b) => b.id === id);
  const user = useSelector(({ auth }) => auth);
  const dispatch = useDispatch();

  const resetCommentState = (input) => {
    setCommentDisabled(false);
    setComment('');
    input?.focus();
  };

  const handleComment = (e) => {
    e.preventDefault();
    const { comment } = e.target;
    setCommentDisabled(true);
    const handleSuccess = () => resetCommentState(comment);
    const handleError = () => resetCommentState(comment);
    dispatch(commentOnBlog(comment.value, blog, handleSuccess, handleError));
  };

  if (!blog) return <Loading />;

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
          onPress={() => {
            setLikeDisabled(true);
            dispatch(likeBlog(blog, () => setLikeDisabled(false)));
          }}
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
                    setRemoveDisabled(true);
                    dispatch(removeBlog(blog, () => navigate('/')));
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
