import { useField } from '../hooks';

const CreateAnecdote = (props) => {
  const { reset: resetContent, ...contentFieldProps } = useField('content');
  const { reset: resetAuthor, ...authorFieldProps } = useField('author');
  const { reset: resetInfo, ...infoFieldProps } = useField('info');

  const handleSubmit = (e) => {
    e.preventDefault();
    props.addNew({
      content: contentFieldProps.value,
      author: authorFieldProps.value,
      info: infoFieldProps.value,
      votes: 0,
    });
  };

  const handleReset = () => {
    resetContent();
    resetAuthor();
    resetInfo();
  };

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...contentFieldProps} />
        </div>
        <div>
          author
          <input {...authorFieldProps} />
        </div>
        <div>
          url for more info
          <input {...infoFieldProps} />
        </div>
        <button type="submit">create</button>
        <button type="button" onClick={handleReset}>
          reset
        </button>
      </form>
    </div>
  );
};

export default CreateAnecdote;
