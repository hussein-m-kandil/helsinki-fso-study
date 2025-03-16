import { useDispatch } from 'react-redux';
import { addAnecdote } from '../slices/anecdoteSlice.js';
import { setNotification } from '../slices/notificationSlice.js';
import truncStr from '../utils/truncStr.js';

const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const handleCreate = (e) => {
    e.preventDefault();
    const form = e.target;
    const content = form.anecdote.value.trim();
    form.submitter.disabled = true;
    form.anecdote.value = '';
    form.anecdote.focus();
    dispatch(addAnecdote(content));
    dispatch(setNotification(`You added: ${truncStr(content)}`, 3000));
  };

  const handleFormChange = (e) => {
    const form = e.currentTarget;
    form.submitter.disabled = !form.anecdote.value;
  };

  return (
    <form
      onSubmit={handleCreate}
      onChange={handleFormChange}
      aria-labelledby="new-anecdote-form-label"
      style={{ marginBlock: '1rem' }}
    >
      <h2
        id="new-anecdote-form-label"
        style={{ margin: 0, display: 'inline-block', fontSize: 'large' }}
      >
        New Anecdote
      </h2>
      <input
        type="text"
        name="anecdote"
        autoComplete="on"
        placeholder="Anecdote content..."
        style={{ margin: '0 0.5rem' }}
      />
      <button type="submit" name="submitter" disabled={true}>
        create
      </button>
    </form>
  );
};

export default AnecdoteForm;
